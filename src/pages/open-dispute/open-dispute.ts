import { Component } from '@angular/core';
import {IonicPage, Modal, ModalController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";
import {AppMinimize} from "@ionic-native/app-minimize";
import {RiderActionsProvider} from "../../providers/rider-actions/rider-actions";
import {MainHomePage} from "../main-home/main-home";

/**
 * Generated class for the OpenDisputePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open-dispute',
  templateUrl: 'open-dispute.html',
})
export class OpenDisputePage {
    modal: Modal;
    modelOpen: boolean = false;
    c_order: any= {};
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private model:ModalController,
                public callNumber: CallNumber,
                public platform: Platform,
                public appMinimize: AppMinimize,
                public riderAction: RiderActionsProvider,
                public toastCtrl: ToastController) {
        if(localStorage.getItem('current_order')) {
            this.c_order = JSON.parse(localStorage.getItem('current_order'));
        }
    }
    cancelOrder():any{
        this.modelOpen =true;
        this.modal =this.model.create('CancelOrderPage');
        this.modal.present();
        this.modal.onDidDismiss((info)=>{
            this.modelOpen = false;
            if(info.cancel == 'yes')
            {
                let body = {
                    oid: this.c_order.order._id,
                    reason: info.issue
                };
                this.riderAction.cancelOrder(body)
                    .subscribe(res=>{
                        if(res.success)
                        {
                            localStorage.removeItem('current_order');
                            this.navCtrl.setRoot(MainHomePage);
                        }
                        else
                        {
                            this.showToast('Unable to open dispute, call base');
                        }
                    })
            }
        });
    }
    paymetIssues():any{
        this.modelOpen =true;
        this.modal = this.model.create('PaymentIssuesPage');
        this.modal.present();
        this.modal.onDidDismiss((info)=>{
            this.modelOpen = false;
            if(info.backpress != 'yes') {
                let body = {
                    oid: this.c_order.order._id,
                    issue: 'payment',
                    reason: info.issue
                };
                this.riderAction.openDispute(body)
                    .subscribe(res => {
                        if (res.success) {
                            localStorage.removeItem('current_order');
                            this.navCtrl.setRoot(MainHomePage);
                        }
                        else {
                            this.showToast('Unable to open dispute, call base');
                        }
                    })
            }
        });
    }

   technicalIssues():any{
       this.modelOpen =true;
       this.modal = this.model.create('TechnicalIssuesPage');
       this.modal.present();
       this.modal.onDidDismiss((info)=>{
           this.modelOpen = false;
           if(info.backpress != 'yes') {
               let body = {
                   oid: this.c_order.order._id,
                   issue: 'technical',
                   reason: info.issue
               };
               this.riderAction.openDispute(body)
                   .subscribe(res => {
                       if (res.success) {
                           localStorage.removeItem('current_order');
                           this.navCtrl.setRoot(MainHomePage);
                       }
                       else {
                           this.showToast('Unable to open dispute, call base');
                       }
                   })
           }
       });
    }
    damageIssues():any{
        this.modelOpen =true;
        this.modal = this.model.create('DamageIssuesPage');
        this.modal.present();
        this.modal.onDidDismiss((info)=>{
            this.modelOpen = false;
            if(info.backpress != 'yes') {
                let body = {
                    oid: this.c_order.order._id,
                    issue: 'damage',
                    reason: info.issue
                };
                this.riderAction.openDispute(body)
                    .subscribe(res => {
                        if (res.success) {
                            localStorage.removeItem('current_order');
                            this.navCtrl.setRoot(MainHomePage);
                        }
                        else {
                            this.showToast('Unable to open dispute, call base');
                        }
                    })
            }
        });
    }
    showToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }
    callbase(){
        this.callNumber.callNumber('Mobile Number', true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OpenDisputePage');
  }
  closeModel()
  {
      if(this.modelOpen) {
          this.modelOpen = false;
          this.modal.dismiss({backpress: 'yes'});
      }
  }
    ionViewWillEnter() {
        console.log('Entered');
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if(this.modelOpen){
                this.modelOpen = false;
                this.modal.dismiss({backpress: 'yes'});
            }
            else if (this.navCtrl.canGoBack()) {
                this.navCtrl.pop();
            } else {
                // platform.exitApp(); // IF IT'S THE ROOT, EXIT THE APP.
                this.appMinimize.minimize();
            }
        });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
}

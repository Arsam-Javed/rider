import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Modal, Platform, ToastController} from 'ionic-angular';
import {AppMinimize} from "@ionic-native/app-minimize";
import {RiderActionsProvider} from "../../providers/rider-actions/rider-actions";

/**
 * Generated class for the EditOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-order',
  templateUrl: 'edit-order.html',
})
export class EditOrderPage {
  c_order: any = {};
    modal:Modal;
    modelOpen: boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private model:ModalController,
              public platform: Platform,
              public appMinimize: AppMinimize,
              public riderActions: RiderActionsProvider,
              public toastCtrl: ToastController
  ) {
      if(localStorage.getItem('current_order')) {
          this.c_order = JSON.parse(localStorage.getItem('current_order'));
      }
  }
    closeEdit(){
        this.navCtrl.push('CustomerDetailsXPage')
    }
    addItem(){
        this.modelOpen = true;
        this.modal = this.model.create('AddItemPage', {
            items: this.c_order.order.items
        });
        this.modal.present();
        this.modal.onDidDismiss((info) => {
            this.modelOpen = false;
            if(!info.byback)
            {
                let total = 0;
                this.c_order.order.items = info.items;
                for(let i=0; info.items[i]; i++)
                {
                    total += info.items[i].subtotal;
                }
                this.c_order.order.total = total;
                this.c_order.order['discount_amount'] = (1*this.c_order.order['total'] * this.c_order.order['discount_percent']) / 100;
                this.c_order.order['revenue'] = this.c_order.order['total'] - this.c_order.order['discount_amount'];
            }
        });
    }
  cancel(){
     this.navCtrl.push('CustomerDetailsXPage', {oid: this.c_order.order._id});
  }
  edit(){
      let body = {
          oid: this.c_order.order._id,
          items: this.c_order.order.items,
          total: this.c_order.order.total,
          discount_amount: this.c_order.order['discount_amount'],
          revenue: this.c_order.order['revenue']
      };
      this.riderActions.editOrder(body)
          .subscribe(res=>{
              if(res.success)
              {
                  this.showToast('Order has been updated successfully');
                  localStorage.setItem('current_order', JSON.stringify(res.current_order));
                  this.navCtrl.push('CustomerDetailsXPage', {oid: this.c_order.order._id});
              }
              else
              {
                  this.showToast('Unable to update order!');
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditOrderPage');
  }
    ionViewWillEnter() {
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if(this.modelOpen){
                this.modelOpen = false;
                this.modal.dismiss({byback: true});
            }
            else if (this.navCtrl.canGoBack()) {
                this.navCtrl.pop();
            } else {
                this.appMinimize.minimize();
            }
        });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
}

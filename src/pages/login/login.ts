import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {RiderProvider} from "../../providers/rider/rider";
import {MainHomePage} from "../main-home/main-home";
import {AppMinimize} from "@ionic-native/app-minimize";
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string = '';
  password: string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _rider: RiderProvider,
              public toastCtrl: ToastController,
              public platform: Platform,
              public appMinimize: AppMinimize,
              public keyboard: Keyboard) {
      this.keyboard.onKeyboardShow()
          .subscribe(event=>{
              let div: HTMLDivElement = <HTMLDivElement> document.getElementById('login-form');
              div.classList.add('scrollfinsh');
          });
      this.keyboard.onKeyboardHide()
          .subscribe(event=>{
              let div: HTMLDivElement = <HTMLDivElement> document.getElementById('login-form');
              div.classList.remove('scrollfinsh');
          });
  }
login(){
    let data = {
      username: this.username,
        password: this.password
    };
    this._rider.login(data)
        .subscribe(res=>{
            if(res.success)
            {
                localStorage.setItem('user_token', res.token);
                if(res.current_order && res.current_order.status != 'done'){
                    localStorage.setItem('current_order', JSON.stringify(res.current_order));
                }
                this.presentToast('Logged in successfully');
                this.navCtrl.setRoot(MainHomePage);
            }
            else {
                this.presentToast(res.errorMsg);
            }
        });
}
    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
    ionViewWillEnter() {
        console.log('Entered');
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if (this.navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
                this.navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
            } else {
                this.appMinimize.minimize();
            }
        });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
}

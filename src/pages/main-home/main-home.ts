import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {TokenProvider} from "../../providers/token/token";
import {LoginPage} from "../login/login";
import {RiderActionsProvider} from "../../providers/rider-actions/rider-actions";
import {AppMinimize} from "@ionic-native/app-minimize";
import {Socket} from "ng-socket-io";
import { Geolocation } from '@ionic-native/geolocation';
import {Observable} from "rxjs/Observable";
/**
 * Generated class for the MainHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-main-home',
  templateUrl: 'main-home.html',
})
export class MainHomePage {
  name: string = '';
  loaded: boolean = false;
  orderstopick : number = 0;
  orderstodeliver: number = 0;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public token: TokenProvider,
              public rideraction: RiderActionsProvider,
              public platform: Platform,
              public appMinimize: AppMinimize,
              public toastCtrl: ToastController,
              public socket: Socket,
              public geolocation: Geolocation) {
    this.name = this.token.name();
    this.rideraction.getOrders()
        .subscribe(res=>{
          if(res.success)
          {
            this.orderstopick = res.orderstopick.length;
            this.orderstodeliver = res.orderstodeliver.length;
            this.loaded = true;
          }
        });
      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket.connect();
      this.socket.on('connect', () => {
          this.socket.emit('authenticate', {token: localStorage.getItem('user_token')});
      });
      let watch = this.geolocation.watchPosition({ enableHighAccuracy: true,maximumAge: 8000});
      watch.subscribe((data) => {
          if(data) {
              let originlat = data.coords.latitude;
              let originlong = data.coords.longitude;
              let data2 = {
                  lat: originlat,
                  lng: originlong
              };
              this.socket.emit('sendmylocation',data2);
          }
      }, err=>{
          console.log(err);
      });
      this.getOrders().subscribe(order => {
          console.log(order);
          this.rideraction.getOrders()
              .subscribe(res=>{
                  if(res.success)
                  {
                      this.orderstopick = res.orderstopick.length;
                      this.orderstodeliver = res.orderstodeliver.length;
                      this.loaded = true;
                  }
              });

      });
      this.getOrdersToDeliver().subscribe(order => {
          this.rideraction.getOrders()
              .subscribe(res=>{
                  if(res.success)
                  {
                      console.log(res);
                      this.orderstopick = res.orderstopick.length;
                      this.orderstodeliver = res.orderstodeliver.length;
                      this.loaded = true;
                  }
              });

      });
  }
    getOrders() {
        let observable = new Observable(observer => {
            this.socket.on('orderupdate', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }

    getOrdersToDeliver() {
        let observable = new Observable(observer => {
            this.socket.on('ordertodeliverupdateupdate', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }
    logout(){
      this.socket.removeAllListeners();
      this.socket.disconnect();
      localStorage.clear();
      this.navCtrl.setRoot(LoginPage);
    }
    openriderdetails() {
        this.navCtrl.push('OrderDetailsPage');
    }
    pickupOrder(){
    this.navCtrl.push('PickOrderPage')
    }
    deliverOrder(){
        this.navCtrl.push('DeliverOrderPage')
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainHomePage');
      this.rideraction.getOrders()
          .subscribe(res=>{
              if(res.success)
              {
                  this.orderstopick = res.orderstopick.length;
                  this.orderstodeliver = res.orderstodeliver.length;
                  this.loaded = true;
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
    ionViewWillEnter() {
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if (this.navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
                this.navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
            } else {
                this.appMinimize.minimize();
            }
        });
        this.rideraction.getOrders()
            .subscribe(res=>{
                if(res.success)
                {
                    this.orderstopick = res.orderstopick.length;
                    this.orderstodeliver = res.orderstodeliver.length;
                    this.loaded = true;
                }
            });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }

}

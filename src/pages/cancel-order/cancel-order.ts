import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the CancelOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html',
})
export class CancelOrderPage {
    cancel: boolean = false;
    issue: string = '';
    constructor(public navCtrl: NavController, public navParams: NavParams,private view:ViewController) {
    }
    closeModel(action: string){
        if(action == 'yes')
        {
            this.cancel = true;
        }
        else {
            this.cancel = false;
            this.view.dismiss({cancel: action});
        }
    }
    submit(){
        this.view.dismiss({cancel: 'yes', issue: this.issue});
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelOrderPage');
  }

}

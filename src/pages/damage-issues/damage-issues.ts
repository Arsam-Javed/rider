import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the DamageIssuesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-damage-issues',
  templateUrl: 'damage-issues.html',
})
export class DamageIssuesPage {
    issue: string = '';
    constructor(public navCtrl: NavController, public navParams: NavParams,private view:ViewController) {
    }
    closeModel(){
        this.view.dismiss({backpress: 'no', issue: this.issue});
    }

    ionViewDidLoad() {
    console.log('ionViewDidLoad DamageIssuesPage');
  }

}

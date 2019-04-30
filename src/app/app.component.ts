import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from "../pages/login/login";
import {MainHomePage} from "../pages/main-home/main-home";
import {Socket} from "ng-socket-io";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public socket: Socket) {
      statusBar.backgroundColorByHexString('#329594');
      if(localStorage.getItem('user_token'))
      {
          this.rootPage = MainHomePage;
      }
      else {
          this.rootPage = LoginPage;
      }
        platform.ready().then(() => {
            this.socket.disconnect();
            this.socket.removeAllListeners();
            this.socket.connect();
            this.socket.on('connect', () => {
                this.socket.emit('authenticate', {token: localStorage.getItem('user_token')});
            });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}


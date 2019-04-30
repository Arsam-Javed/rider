import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: '', options: {transports: ['websocket']} };
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import { RiderProvider } from '../providers/rider/rider';
import { RiderActionsProvider } from '../providers/rider-actions/rider-actions';
import {MainHomePage} from "../pages/main-home/main-home";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { TokenProvider } from '../providers/token/token';
import { Geolocation } from '@ionic-native/geolocation';
import {GoogleMaps} from "@ionic-native/google-maps";
import {AppMinimize} from "@ionic-native/app-minimize";
import {CallNumber} from "@ionic-native/call-number";
import { Keyboard } from '@ionic-native/keyboard';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
      LoginPage,
      MainHomePage
  ],
  imports: [
      HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      LoginPage,
      MainHomePage
  ],
  providers: [
      Keyboard,
      CallNumber,
      AppMinimize,
      GoogleMaps,
      Geolocation,
      HttpClient,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RiderProvider,
    RiderActionsProvider,
    TokenProvider
  ]
})
export class AppModule {}

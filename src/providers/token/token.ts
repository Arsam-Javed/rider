import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {JwtHelper} from "angular2-jwt";
/*
  Generated class for the TokenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenProvider {
    jwtHelper: JwtHelper = new JwtHelper();
    constructor(public http: HttpClient) {
    }

    username() {
        console.log(this.jwtHelper.decodeToken(localStorage.getItem('user_token')).u);
        return this.jwtHelper.decodeToken(localStorage.getItem('user_token')).u;
    }
    name() {
        console.log(this.jwtHelper.decodeToken(localStorage.getItem('user_token')).n);
        return this.jwtHelper.decodeToken(localStorage.getItem('user_token')).n;
    }
}

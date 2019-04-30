import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the RiderActionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RiderActionsProvider {
    baseurl :string = "";
  constructor(public http: HttpClient) {
  }
    arrived(body: any):Observable<any>{
        return this.http.post(this.baseurl+'arrived',JSON.stringify(body),{
            headers: new HttpHeaders().set('token', localStorage.getItem('user_token')).set('Content-Type', 'application/json')})

    }
    editOrder(body: any):Observable<any>{
        return this.http.post(this.baseurl+'editorder',JSON.stringify(body),{
            headers: new HttpHeaders().set('token', localStorage.getItem('user_token')).set('Content-Type', 'application/json')})

    }
    getProducts():Observable<any>{
    return this.http.get(this.baseurl+'getproducts',{
    headers: new HttpHeaders().set('token', localStorage.getItem('user_token'))})
    }
    cancelOrder(body: any):Observable<any>{
        return this.http.post(this.baseurl+'cancelorder',JSON.stringify(body),{
            headers: new HttpHeaders().set('token', localStorage.getItem('user_token')).set('Content-Type', 'application/json')})

    }
}

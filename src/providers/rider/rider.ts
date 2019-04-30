import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the RiderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RiderProvider {
    baseurl :string = "";
  constructor(public http: HttpClient) {
  }
    login(json):Observable<any>{
        return this.http.post(this.baseurl+'login/',JSON.stringify(json),{
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        })

    }
}

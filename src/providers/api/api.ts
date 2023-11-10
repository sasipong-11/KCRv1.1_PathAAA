import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Option } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class ApiProvider {
  public data: any;

  //new Host
  _Host: string = 'http://ld.aaa.in.th/kidcanread/word/';

  //_Host: string = 'http://ld.in.th/kidcanread/word/';

  _HostTest: string = 'http://192.168.1.105/readingbook/select_book.php';

  _HostActivate: string = 'http://203.185.132.44:8080/apis/activationV3_kcr.php?cid=635&pid=10&bid=FKNECIHIWBAATBDEFTB0IFR0F&id=538&name=LD&org=NSTDA&tel=888&prgVersion=KidCanRead';


  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

  public getActivateData(param: any) {
    return new Promise((resolve, reject) => {
      let url = this._HostActivate + "";
      this.http.post(url, param)
        .subscribe(res => {
          resolve(res);
          console.log(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public getQrData(param: any) {
    return new Promise((resolve, reject) => {
      let url = this._Host + "select_word_2.php";
      this.http.post(url, param)
        .subscribe(res => {
          resolve(res);
          console.log(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public getExpireDate() {
    return new Promise((resolve, reject) => {
      let url = this._Host + "expire_date.php";
      this.http.get(url)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public getTest() {
    return new Promise((resolve, reject) => {
      let url = this._HostTest;
      this.http.get(url)
        .subscribe(res => {
          resolve(res);
          console.log(res);
        }, (err) => {
          reject(err);
        });
    });
  }


}

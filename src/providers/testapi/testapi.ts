import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TestapiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TestapiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TestapiProvider Provider');
  }

  public getQR(code) {
    return new Promise((resolve, reject) => {
      let url = "http://www.masterdev.cf/word/select_word.php";
      let fd = new FormData();
      fd.append("word_code", code);
      this.http.post(url, fd)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}

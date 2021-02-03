import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/index';
import { c } from '@angular/core/src/render3';
import { CompileNgModuleMetadata } from '@angular/compiler';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';



/*
  Generated class for the TestsqliteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TestsqliteProvider {

  databaseObj: SQLiteObject;
  public row_data: any = [];

  constructor(public http: HttpClient,
    public sqlite: SQLite,
    private sqliteDbCopy: SqliteDbCopy
    ) {

    console.log('Hello TestsqliteProvider Provider');
  }



  public async getSQLiteData(word_code){

    await this.sqliteDbCopy.copy('KCR_Data.db', 0)
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));




    await this.sqlite.create({
      name: 'KCR_Data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        console.log(db + ' Created !!');
        return new Promise((resolve, reject) => {
        db.executeSql("SELECT * FROM kcr_content " +
         "WHERE word_code = '"+ word_code + "' " , [])
        .then((res) => {
          this.row_data = [];
          if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
              this.row_data.push(res.rows.item(i));
            }
            resolve(this.row_data);
            console.log(this.row_data);
            console.log(this.row_data[0]);
          }
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
          reject(e);
        });
      });
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }




}

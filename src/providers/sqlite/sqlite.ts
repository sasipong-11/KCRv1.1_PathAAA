import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/index';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';


/*
  Generated class for the SqliteProvider provider.

*/
@Injectable()
export class SqliteProvider {

  databaseObj: SQLiteObject;
  public row_data: any = [];

  constructor(public http: HttpClient,
    public sqlite: SQLite,
    private sqliteDbCopy: SqliteDbCopy) {
    console.log('Hello SqliteProvider Provider');
  }

  public async getSQLiteData(word_code){


    /* คัดลอกฐานข้อมูลชื่อ KCR_Data.db จากโฟลเดอร์ www เข้าสู่หน่วยความจำโทรศัพท์ */
    await this.sqliteDbCopy.copy('KCR_Data.db', 0)
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));


    /* เข้าถึงฐานข้อมูลที่ถูกคัดลอก */
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

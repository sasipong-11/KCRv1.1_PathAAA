// import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  /**
   * @DB 'KidCanRead'
   *
   * @table 'kdr_tb_history'
   * @field 'his_id'
   * @field 'his_text'
   * @field 'his_code'
   * @field 'his_spell'
   * @field 'his_index'
   * @table 'kdr_tb_level'
   * @field 'level'
   */
  private db = {
    "name": "KidCanRead",
    "tables": {
      "kdr_tb_history": [],
      "kdr_tb_level": {
        "level": ""
      }
    }
  };

  private tb_name_pk = {
    "kdr_tb_history": "his_id"
  };

  status: boolean = false;

  constructor(public storage: Storage) {
    this.fetch();
  }

  create() {
    this.storage.set(this.db.name, JSON.stringify(this.db.tables));
  }

  getDBName() {
    return this.db.name;
  }
  fetch(page: string = '') {
    this.storage.get(this.db.name).then(res => {
      let tables = JSON.parse(res);
      console.log('fetch : ' + page);
      console.log(tables);
      if (tables != null) {
        this.db.tables = tables;
      }
    }).catch(err => console.log(err));
  }
  commit(namePage: string = "==") {
    if (this.status == true) {
      console.log("commit=", namePage);
      this.storage.set(this.db.name, JSON.stringify(this.db.tables));//replace all new
    }
  }
  get(tb_name) {
    return this.db.tables[tb_name];
  }
  getBy(tb_name, col_name, value) {
    let temp_table = this.db.tables[tb_name];
    let temp_rows = Array();
    for (let i = 0; i < temp_table.length; i++) {
      if (temp_table[i][col_name] == value) {
        temp_rows.push(temp_table[i]);
      }
    }
    return temp_rows;
  }
  getBy2(tb_name, tb_col, tb_col_val, tb_col2, tb_col_val2) {
    let temp_table = this.db.tables[tb_name];
    let temp_rows = Array();
    for (let i = 0; i < temp_table.length; i++) {
      if ((temp_table[i][tb_col] == tb_col_val) && (temp_table[i][tb_col2] == tb_col_val2)) {
        temp_rows.push(temp_table[i]);
      }
    }
    return temp_rows;
  }
  set(tb_name, tb_rows) {
    this.status = true;
    this.db.tables[tb_name] = tb_rows;
  }
  async replace(tb_name, tb_rows, tb_col, tb_col_val) {
    this.status = true;
    await this.deleteBy(tb_name, tb_col, tb_col_val);
    let temp_table = this.db.tables[tb_name];
    for (let i = 0; i < tb_rows.length; i++) {
      temp_table.push(tb_rows[i]);
    }
    this.db.tables[tb_name] = temp_table;
  }
  async replaceBy(tb_name, tb_rows, tb_col, tb_col_val, tb_col2, tb_col_val2) {
    this.status = true;
    let temp_table = this.db.tables[tb_name];
    let temp_new_table = Array();
    for (let i = 0; i < temp_table.length; i++) {
      if ((temp_table[i][tb_col] == tb_col_val) && (temp_table[i][tb_col2] == tb_col_val2)) {
        temp_new_table.push(temp_table[i]);
      }
    }
    for (let i = 0; i < tb_rows.length; i++) {
      temp_new_table.push(tb_rows[i]);
    }
    await this.replace(tb_name, temp_new_table, tb_col, tb_col_val);
  }
  async delete(tb_name, value) {
    let temp_table = this.db.tables[tb_name];
    let temp = Array();
    for (let i = 0; i < temp_table.length; i++) {
      if (temp_table[i][this.tb_name_pk[tb_name]] != value) {
        temp.push(temp_table[i]);
      }
    }
    this.db.tables[tb_name] = temp;
    this.status = true;
    this.commit();
  }

  ClearHistory(tb_name) {
    let temp = Array();

    this.db.tables[tb_name] = temp;
    this.status = true;
    this.commit();
  }

  DeleteHistory(sortHistory){
    //เพื่อสลับตำแหน่งของอาเรย์ไว้ในตำแหน่งเดิม จากนำลำดับสุดท้ายมไว้ลำดับแรก สลับเป็นนำลำดับแรกไว้ลำดับสุดท้ายตามค่าตั้งต้น
    let history = Array();
    for(let i=sortHistory.length-1;i>=0;i--){
      history.push(sortHistory[i])
    }
    this.db.tables['kdr_tb_history'] = history;
    this.status = true;
    this.commit();
  }

  deleteBy(tb_name, tb_col, value) {
    let temp_table = this.db.tables[tb_name];
    let temp = Array();
    for (let i = 0; i < temp_table.length; i++) {
      if (temp_table[i][tb_col] != value) {
        temp.push(temp_table[i]);
      }
    }
    this.db.tables[tb_name] = temp;
    this.status = true;
    this.commit();
  }
  push(tb_name, tb_row) {
    this.status = true;
    if (tb_row[this.tb_name_pk[tb_name]] == 0) {
      tb_row[this.tb_name_pk[tb_name]] = this.autoId(tb_name);
    }
    this.db.tables[tb_name].push(tb_row);
  }
  autoId(tb_name) {
    let id = 0;
    let temp_table = this.db.tables[tb_name];
    if (temp_table != []) {
      for (let row of temp_table) {
        id = Math.max(id, row[this.tb_name_pk[tb_name]]);
      }
    }
    return id += 1;
  }
  async update(tb_name, row) {
    this.status = true;
    await this.delete(tb_name, row[this.tb_name_pk[tb_name]]);
    await this.push(tb_name, row);
  }

  updateLevel(lvl: string = "") {
    this.db.tables.kdr_tb_level.level = lvl;
    this.status = true;
  }

  getLevel() {
    let res = this.db.tables.kdr_tb_level.level == "" ? "default" : this.db.tables.kdr_tb_level.level ;
    return res;
  }

  clearLevel() {
    let temp = "default";

    this.db.tables.kdr_tb_level.level = temp;
    this.status = true;
    this.commit();
  }

  setWord(tb_name, row_id: number, tb_row) {
    let temp_table = this.db.tables[tb_name];
    let check: boolean = false;
    let index: number = -1;
    for (let i in temp_table) {
      if (parseInt(temp_table[i][this.tb_name_pk[tb_name]]) == row_id) {
        console.log(row_id);
        index = parseInt(i);
        check = true;
      }
    }
    if (check) {
      this.db.tables.kdr_tb_history.splice(index, 1);
    }
    this.db.tables[tb_name].push(tb_row);
    this.status = true;
  }
}

import { Component, ViewChild, Renderer, ElementRef, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ScanPage } from '../scan/scan';
import { ApiProvider } from '../../providers/api/api';
import { StorageProvider } from '../../providers/storage/storage';
import { StartPage } from '../start/start';
import { Storage } from '@ionic/storage';

import { TestsqliteProvider } from '../../providers/testsqlite/testsqlite';
import { Media, MediaObject } from '@ionic-native/media/index';
import { File } from '@ionic-native/file/index';
import { SqliteProvider } from '../../providers/sqlite/sqlite';




@IonicPage()
@Component({
  selector: 'page-showoffline',
  templateUrl: 'showoffline.html',
})
export class ShowofflinePage {

  @ViewChildren('spell', { read: ElementRef }) _spelltext;
  @ViewChild('cooldown', { read: ElementRef }) _cooldown;

  theme: string = 'default';
  _font_size: number = 6;
  _text_limit: number = 20;
  _image: string = "blank";
  _image_callout: string = "1_0";
  _state: boolean = false;

  qrData: any;

  _audio: MediaObject = null;

  _readWord_status: boolean = true;

  _spelling: any;
  _spelling_time: number = 500; // ms
  _spelling_status: boolean = false;

  _refresh_status: boolean = false;
  _CheckRefresh_status: boolean = false;

  _word_spell: string = '';
  _word_name: string = '';
  _word_qrcode: string = '';
  _word_path: string = '';
  _word_level: string = 'p0';
  _word_path_2: string = '';

  _text_level: string = '';

  _page: string = 'startpage';

  _scan_status: boolean = false;

  _ionLeave_status = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private nativePageTransitions: NativePageTransitions,
    private apiPro: ApiProvider,
    private loadCtrl: LoadingController,
    private storage: StorageProvider,
    private render: Renderer,
    public storageDevice: Storage,
    private sqlPro: SqliteProvider,
    private file: File,
    private media: Media,

  ) {

    // this.qrData = this.navParams.get('qrData');
    // this.qrData = "dIg1MCp4uCY8JI0ytsiW2fymlBWBjuso";

    // if (this.qrData == null) {
    //   let options: NativeTransitionOptions = {
    //     duration: 800
    //   };
    //   this.nativePageTransitions.fade(options);
    //   this.navCtrl.push(ScanPage);
    // }

    this._spelling = Array();
    this.storage.fetch();

    this._page = this.navParams.get('page');
    this.theme = this.storage.getLevel();
  }

  ionViewDidLoad() {
    // data for test
    this.qrData = "PLMw9IDwwK7owKOwLTLMRfLx/H4oLA1f";
  }

  ionViewWillEnter() {

    this.qrData = this.qrData == undefined ? this.navParams.get('qrData') : this.qrData;
    if (this.qrData != null) {
      // this._state = true;
      if (this.platform.is('android') || this.platform.is('ios')) {
        // set to Orientation
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
      if (this._page == 'historypage') {
        console.log(this._page);
        this._CheckRefresh_status = true;
      }

      this._ionLeave_status = false;
      this.getData();
    } else if ((this.qrData == null) && this._scan_status) {
      this.back();
    } else {
      this._scan_status = true;
      let options: NativeTransitionOptions = {
        duration: 800
      };
      this.nativePageTransitions.fade(options);
      this.navCtrl.push(ScanPage);
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  back() {

    if ((this._page == 'historypage') || (this._page == 'startpage')) {

      let options: NativeTransitionOptions = {
        direction: 'down',
        duration: 500,
        slowdownfactor: -1,
        slidePixels: 20
      };
      this.nativePageTransitions.slide(options);
      this.navCtrl.pop();
    } else {

      let options: NativeTransitionOptions = {
        duration: 800
      };
      this.nativePageTransitions.fade(options);
      this.navCtrl.setRoot(StartPage);
    }
  }

  async getData() {
    let loading = this.loadCtrl.create({
      content: 'กรุณารอสักครู่...'
    });
    loading.present();

    this._image_callout = this.getRandomInt(3) + '_' + this.getRandomInt(4);
    let param = new FormData();
    param.append("word_code", this.qrData);
    console.warn(param.append("word_code", this.qrData));

    await this.sqlPro.getSQLiteData(this.qrData).then((res) => {

      this._state = true;
      this._word_name = this.sqlPro.row_data[0].word_name;
      this._word_spell = this.sqlPro.row_data[0].word_spell;
      this._word_qrcode = this.sqlPro.row_data[0].word_pic;
      this._word_path = this.sqlPro.row_data[0].word_voice_spell;
      this._word_level = this.sqlPro.row_data[0].word_level;
      this._word_path_2 = this.sqlPro.row_data[0].word_voice;

      let date: Date = new Date();

      let row = {
        his_id: this.sqlPro.row_data[0].word_id,
        his_text: this.sqlPro.row_data[0].word_name,
        his_code: this.sqlPro.row_data[0].word_code,
        his_spell: this.sqlPro.row_data[0].word_spell,
        his_level: this.sqlPro.row_data[0].word_level,
        his_date: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
      }
      this.storage.setWord('kdr_tb_history', this.sqlPro.row_data[0].word_id, row);
      this.theme = this._word_level;
      this.storage.updateLevel(this._word_level);
      this.storage.commit('show');
      this._spelling_time = parseInt('500');

      if (this._page == 'historypage') {
        this._readWord_status = false;
        this.refresh();
      } else {
        // this.refresh();         //test แบบไม่นับถอยหลัง
        this._readWord_status = false;
        // this.spelling();
        this.readWord();
      }
    }).catch(error => {
      this.back();
      setTimeout(() => {
        alert('เกิดข้อผิดพลาด');
      }, 2000);
    });
    loading.dismiss();
  }

  ionViewWillLeave() {
    this._ionLeave_status = true;
    if (this._audio != null) {
      this._audio.stop();
      this._audio.release();
    }
  }

  // ฟังก์ชันอ่านคำก่อนสะกดคำ
  readWord() {
    this._refresh_status = true;
    this._readWord_status = true;
    this._audio = this.media.create(this.file.externalApplicationStorageDirectory + 'Voice/word/' + this._word_path_2);

    if (this._word_level.match("p0")) {
      this._text_level = "อนุบาล"
    } else if (this._word_level.match("p1")) {
      this._text_level = "ประถมศึกษาปีที่ 1"
    } else if (this._word_level.match("p2")) {
      this._text_level = "ประถมศึกษาปีที่ 2"
    } else if (this._word_level.match("p3")) {
      this._text_level = "ประถมศึกษาปีที่ 3"
    }

    setTimeout(() => {
      if (this._ionLeave_status == false) {
        this._audio.play();
      }
    }, 1000);


    setTimeout(() => {
      this._readWord_status = false;
      // this._CheckRefresh_status = true;
      this._audio.release();
      this.spelling();
    }, 3500);


  }

  async spelling() {
    if (this._word_spell != '') {

      this._audio = this.media.create(this.file.externalApplicationStorageDirectory + 'Voice/spell/' + this._word_path);
      let limit_: number = 0;
      this._image = this._word_level + '_0';
      this._refresh_status = true;
      this._spelling_status = false;

      setTimeout(() => {
        if (this._ionLeave_status == false) {
          this._audio.play();
        }
      }, 3300);

      setTimeout(() => {
        this._spelling_status = true;
        let temp = this._word_spell.split('-');
        let time = this._spelling_time;
        let words_full = '';
        let words = Array();
        for (let i in temp) {
          if (parseInt(i) > 0) {
            words.push('-');
            words_full += '-';
          }
          if (temp[i] != "") {
            words_full += temp[i];
            words.push(temp[i]);
          }
        }

        // fix font size
        if (words_full.length <= 30) {
          this._font_size = 6;
          this._text_limit = 20; //limit 19
        } else if ((words_full.length > 30) && (words_full.length <= 40)) {
          this._font_size = 5;
          this._text_limit = 25; //limit 24
        } else if ((words_full.length > 40) && (words_full.length <= 60)) {
          this._font_size = 4;
          this._text_limit = 25; //limit 24
        } else {
          this._font_size = 3;
          this._text_limit = 28; //limit 27
        }

        let index = 0, s = 1;
        this._spelling = Array();

        for (let i in words) {
          limit_ += words[i].length;

          //ขึ้นบรรทัดใหม่
          let brSet;
          let check = parseInt(i) - 2;
          if (words[i] != "-" && words[check] == "-") {
            brSet = true;
          } else {
            brSet = false;
          }

          this._spelling.push({
            value: words[i],
            // br: limit_ >= this._text_limit ? true : false,
            br: brSet,
            status: false
          });
          limit_ = limit_ >= this._text_limit ? words[i].length : limit_;

          setTimeout(() => {
            let index_ = index;
            if ((index == 0) && (this._word_path != '')) {
              // this._audio = new Audio(this._word_path);
              // this._audio.play();
            } else {
              setTimeout(() => {
                this._spelling[index_ - 1].status = false;
              }, 400);
              this._image = this._word_level + '_' + s;
              s = s == 3 ? 1 : s + 1;
            }
            if ((index + 1) == words.length) {
              this._refresh_status = false;
              this._image = this._word_level + '_0';
            }

            if (this._spelling[index].value != '-') {
              this._spelling[index].status = true;
              this.render.setElementClass(this._spelltext._results[index].nativeElement, 'color_text', true);
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'opacity', '1');
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'font-size', (this._font_size + 2) + 'vw');

              setTimeout(() => {
                this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'font-size', this._font_size + 'vw');
                if (index != words.length) {
                  this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'opacity', '0');
                }
              }, this._spelling_time);
            }
            index += 1;
          }, time);
          time += this._spelling_time;
        }
      }, 3400);
    }
  }

  async refresh() {
    if (this._word_spell != '') {
      this._audio = this.media.create(this.file.externalApplicationStorageDirectory + 'Voice/spell/' + this._word_path);
      let limit_: number = 0;
      this._image = this._word_level + '_0';
      this._CheckRefresh_status = true;
      this._refresh_status = true;
      this._spelling_status = false;

      setTimeout(() => {
        this._audio.play();
      }, 0);

      setTimeout(() => {
        this._spelling_status = true;
        let temp = this._word_spell.split('-');
        let time = this._spelling_time;
        let words_full = '';
        let words = Array();
        for (let i in temp) {
          if (parseInt(i) > 0) {
            words.push('-');
            words_full += '-';
          }
          if (temp[i] != "") {
            words_full += temp[i];
            words.push(temp[i]);
          }
        }

        // fix font size.
        if (words_full.length <= 30) {
          this._font_size = 6;
          this._text_limit = 20; //limit 19
        } else if ((words_full.length > 30) && (words_full.length <= 40)) {
          this._font_size = 5;
          this._text_limit = 25; //limit 24
        } else if ((words_full.length > 40) && (words_full.length <= 60)) {
          this._font_size = 4;
          this._text_limit = 25; //limit 24
        } else {
          this._font_size = 3;
          this._text_limit = 28; //limit 27
        }
        let index = 0, s = 1;
        this._spelling = Array();

        for (let i in words) {
          limit_ += words[i].length;

          //ขึ้นบรรทัดใหม่
          let brSet;
          let check = parseInt(i) - 2;
          if (words[i] != "-" && words[check] == "-") {
            brSet = true;
          } else {
            brSet = false;
          }

          this._spelling.push({
            value: words[i],
            // br: limit_ >= this._text_limit ? true : false,
            br: brSet,
            status: false
          });
          limit_ = limit_ >= this._text_limit ? words[i].length : limit_;

          setTimeout(() => {
            let index_ = index;
            if ((index == 0) && (this._word_path != '')) {
              // this._audio = new Audio(this._word_path);
              // this._audio.play();
            } else {
              setTimeout(() => {
                this._spelling[index_ - 1].status = false;
              }, 400);
              this._image = this._word_level + '_' + s;
              s = s == 3 ? 1 : s + 1;
            }
            if ((index + 1) == words.length) {
              this._refresh_status = false;
              this._image = this._word_level + '_0';
            }

            if (this._spelling[index].value != '-') {
              this._spelling[index].status = true;
              this.render.setElementClass(this._spelltext._results[index].nativeElement, 'color_text', true);
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'opacity', '1');
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'font-size', (this._font_size + 2) + 'vw');

              setTimeout(() => {
                this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'font-size', this._font_size + 'vw');
                if (index != words.length) {
                  this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'opacity', '0');
                }
              }, this._spelling_time);
            }

            index += 1;
          }, time);

          time += this._spelling_time;
        }

      }, 100);
    }
  }

}

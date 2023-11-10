import { Component, ElementRef, QueryList, Renderer, ViewChild, ViewChildren } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { SqliteProvider } from '../../providers/sqlite/sqlite';
import { StorageProvider } from '../../providers/storage/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ScanPage } from '../scan/scan';
import { StartPage } from '../start/start';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/index';



/**
 * Generated class for the ShowofflineV2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-showoffline-v2',
  templateUrl: 'showoffline-v2.html',
})
export class ShowofflineV2Page {

  @ViewChildren('spell', { read: ElementRef }) _spelltext;
  @ViewChildren('word', { read: ElementRef }) _wordtext;
  @ViewChildren('word2', { read: ElementRef }) _wordtext2;
  @ViewChild('cooldown', { read: ElementRef }) _cooldown;

  // @ViewChildren("divs", { read: ElementRef }) divs: QueryList<ElementRef>;
  @ViewChildren('divs') divs: QueryList<ElementRef>;

  //
  @ViewChildren('spellWord', { read: ElementRef }) _spellWord;




  theme: string = 'default';
  _font_size: number = 6;
  _text_limit: number = 20;
  _image: string = "blank";
  _image_callout: string = "1_0";
  _state: boolean = false;

  qrData: any;

  _audio: MediaObject = null;

  _readWord_status: boolean = true;

  //
  _spelling: any;

  //
  _spelling_word: any;

  _refresh_spelling: any;

  _spelling_time: number = 500; // ms
  _spelling_status: boolean = false;

  _refresh_status: boolean = false;


  _word_spell: string = '';
  _word_name: string = '';
  _word_qrcode: string = '';
  _word_path: string = '';
  _word_level: string = 'p0';
  _word_path_2: string = '';

  //
  _word_index: string = '';
  _text_level: string = '';
  _page: string = 'startpage';
  _scan_status: boolean = false;
  _ionLeave_status = false;

  //
  testword;

  //
  hl_index = 0;

  split_index = [];
  splitindex = [];

  _CheckRefresh_status: boolean = false;

  // _word_index: string = '0-2-02-02-3-023-023-1-0123';    // ข้าว
  // _word_index: string = '1-024-0124-0124-3-01234';    // เบี้ย
  //_word_index: string = '0-1-01-01-3-013-013-2-0123';    //สุ่ม
  // _word_index: string = '0-1-01-01-1-3-013-013-2-0123';    // ปั้น
  // _word_index: string = '0-1-01-01-3-013-013-2-0123';    // ดื่ม

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

    //
    this._spelling = Array();

    //
    this._spelling_word = Array();

    this.storage.fetch();

    this._page = this.navParams.get('page');
    this.theme = this.storage.getLevel();
  }

  ionViewDidLoad() {
    // data for test
    // this.qrData = "PLMw9IDwwK7owKOwLTLMRfLx/H4oLA1f";     // ข้าว
    // this.qrData = "UWpbKvQc2hC6CMZBFySDD5LvAqRyEXfd";     // เบี้ย
    //this.qrData = "2VzjIZ+gxG4wf3zZTKFnO4IqeDX3TcDO";     // สุ่ม
    // this.qrData = "8t2pvW6PW1GGw+sbqZOK+lwK0KU5/q1O";     // ปั้น
    // this.qrData = "9R4TRL2LNuaF3LzSIpU9akeBpuB56E7O";     // ดื่ม
    // this.qrData = "8PbytgOBzZDMCeYhs9XdD1lBlstEio1/";      //คว่ำ
  }



  ionViewWillEnter() {
    this.qrData = this.qrData == undefined ? this.navParams.get('qrData') : this.qrData;
    if (this.qrData != null) {
      // this._state = true;
      if (this.platform.is('android') || this.platform.is('ios')) {
        // set to Orientation
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
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

  //โหลดข้อมูลแบบออนไลน์ โดย api provider สำหรับ test -> ionic serve
  async getData_old() {
    let loading = this.loadCtrl.create({
      content: 'กรุณารอสักครู่...'
    });
    loading.present();

    this._image_callout = this.getRandomInt(3) + '_' + this.getRandomInt(4);

    let param = new FormData();
    param.append("word_code", this.qrData);
    console.warn(param.append("word_code", this.qrData));

    await this.apiPro.getQrData(param).then(response => {
      if (response["status"] == true) {

        console.log(response);


        this._state = true;
        this._word_name = response["word_name"];
        this._word_spell = response["word_spell"];
        this._word_qrcode = response["word_code"];
        this._word_path = response["word_path"];
        this._word_level = response["word_level"];
        this._word_index = response["word_index"];

        let date: Date = new Date();

        let row = {
          his_id: response["word_id"],
          his_text: response["word_name"],
          his_code: response["word_code"],
          his_spell: response["word_spell"],
          his_level: response["word_level"],
          his_index: response["word_index"],
          his_date: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        }

        this.storage.setWord('kdr_tb_history', response["word_id"], row);

        this.theme = this._word_level;
        this.storage.updateLevel(this._word_level);


        this.storage.commit('show');

        this._spelling_time = parseInt(response["word_time"]);
        this._readWord_status = false;

        //this.spelling();
        this.readWord();

      } else {
        this.back();
      }
    }).catch(error => {
      this.back();
      setTimeout(() => {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่ออินเทอร์เน็ต');
      }, 2000);
    });

    loading.dismiss();
  }

  //โหลดข้อมูลแบบออฟไลน์ โดย sqlite provider ติดตั้งครั้งแรกต้องโหลดข้อมูลที่หน้า Download ก่อน
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
      this._word_index = this.sqlPro.row_data[0].word_index;

      let date: Date = new Date();

      let row = {
        his_id: this.sqlPro.row_data[0].word_id,
        his_text: this.sqlPro.row_data[0].word_name,
        his_code: this.sqlPro.row_data[0].word_code,
        his_spell: this.sqlPro.row_data[0].word_spell,
        his_level: this.sqlPro.row_data[0].word_level,
        his_index: this.sqlPro.row_data[0].word_index,
        his_date: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
      }
      this.storage.setWord('kdr_tb_history', this.sqlPro.row_data[0].word_id, row);
      this.theme = this._word_level;
      this.storage.updateLevel(this._word_level);
      this.storage.commit('show');
      this._spelling_time = parseInt("500");

      if (this._page == 'historypage') {
        this._readWord_status = false;
        this.refresh();
      } else {
        //this.refresh();         //ปุ่ม refresh (test แบบไม่นับถอยหลัง)
        this._readWord_status = false;
        // this.spelling();     //ไปฟังก์ชันอ่านแจกลูก
        this.readWord();     //ไปฟังก์ชันอ่านคำก่อน แล้วไปฟังก์ชันอ่านแจกลูก
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

  //ฟังก์ชันแยกตัวอักษรและจัดรูปแบบ
  async creatText() {
    console.log(this._word_name);
    this.split_index = this._word_index.split("-");
    var splittext = this._word_name.split("");
    this.testword = splittext;
    var divsLength: any = this.divs.length;
    const elementArray = this.divs.toArray();
    console.log("splittext :" + splittext);

    for (let i = 0; i < divsLength; i++) {

      // Case วรรณยุกต์อยู่บนสระ
      if (
        i != 0 &&
        ((elementArray[i - 1].nativeElement.innerText === "ิ"      // สระอิ
          || elementArray[i - 1].nativeElement.innerText === "ี"   // สระอี
          || elementArray[i - 1].nativeElement.innerText === "ึ"   // สระอึ
          || elementArray[i - 1].nativeElement.innerText === "ื"   // สระอือ
          || elementArray[i - 1].nativeElement.innerText === "ั")  // ไม้หันอากาศ

          && (elementArray[i].nativeElement.innerText === "่"      // และ index เท่ากับ ไม้เอก
            || elementArray[i].nativeElement.innerText === "้"     // ไม้โท
            || elementArray[i].nativeElement.innerText === "๊"     // ไม้ตรี
            || elementArray[i].nativeElement.innerText === "๋"))   // ไม้จัตวา

      ) {
        elementArray[i].nativeElement.innerHTML =               // ให้เลื่อนวรรณยุกต์ขึ้นไป 26%
          '<div style=" color: black; transform: translateY(-26%); margin-top: 10px; font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
      }
      else {
        elementArray[i].nativeElement.innerHTML = '<div style="color: black; font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
      }


      // case สระอุ สระอู
      if (elementArray[i].nativeElement.innerText === "ุ"      // ถ้า index เท่ากับ สระอุ สระอู
        || elementArray[i].nativeElement.innerText === "ู"
      ) {                                                      // ให้เลื่อนสระขึ้นไป 13%
        elementArray[i].nativeElement.innerHTML =
          '<div style=" transform: translateY(-18%); font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
      }

      // Case วรรณยุกต์ มาก่อน สระอำ
      if ((elementArray[i].nativeElement.innerText === "่"      // ถ้า index เท่ากับ ไม้เอก
        || elementArray[i].nativeElement.innerText === "้"     // ไม้โท
        || elementArray[i].nativeElement.innerText === "๊"     // ไม้ตรี
        || elementArray[i].nativeElement.innerText === "๋")     // ไม้จัตวา
        && elementArray[i + 1].nativeElement.innerText === "ำ"   // และ index + 1 คือ สระอำ
      ) {                                                     // ให้เลื่อนสระขึ้นไป 13%
        elementArray[i].nativeElement.innerHTML =
          '<div style=" transform: translateY(-18%); font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
      }


    }
  }

  //ฟังก์ชันไฮไลต์ตัวอักษรตามค่า index
  async highlightText(index) {
    this.split_index = this._word_index.split("-");
    this.splitindex = this.split_index[index].split("");
    var divsLength: any = this.divs.length;
    const elementArray = this.divs.toArray();
    console.log("splitindex : " + this.splitindex);

    for (let i = 0; i < divsLength; i++) {
      for (let j = 0; j < this.splitindex.length; j++) {
        let splitint: number = +this.splitindex[j];
        if (i == splitint) {
          elementArray[splitint].nativeElement.innerHTML = '<div style="color: #dc7633; font-weight: normal;"> ' + elementArray[splitint].nativeElement.innerText + ' </div>';

          // Case วรรณยุกต์อยู่บนสระ
          if (elementArray[i - 1] != null) {                            // ถ้า index ก่อนหน้า เท่ากับ
            if ((elementArray[i - 1].nativeElement.innerText === "ิ"    // สระอิ
              || elementArray[i - 1].nativeElement.innerText === "ี"   // สระอี
              || elementArray[i - 1].nativeElement.innerText === "ึ"   // สระอึ
              || elementArray[i - 1].nativeElement.innerText === "ื"   // สระอือ
              || elementArray[i - 1].nativeElement.innerText === "ั")   // ไม้หันอากาศ
              && (elementArray[i].nativeElement.innerText === "่"       // และ index เท่ากับ ไม้เอก
                || elementArray[i].nativeElement.innerText === "้"       // ไม้โท
                || elementArray[i].nativeElement.innerText === "๊"       // ไม้ตรี
                || elementArray[i].nativeElement.innerText === "๋")       // ไม้จัตวา
            ) {
              elementArray[i].nativeElement.innerHTML =               // ให้เลื่อนวรรณยุกต์ขึ้นไป 26%
                '<div style=" color: #dc7633; transform: translateY(-26%); margin-top: 10px; font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
            }
          }

          // Case สระอยู่ข้างล่าง สระ อุ / สระ อู
          if (elementArray[i].nativeElement.innerText === "ุ"      // ถ้า index เท่ากับ สระอุ สระอู
            || elementArray[i].nativeElement.innerText === "ู"
          ) {                                                     // ให้เลื่อนสระขึ้นไป 13%
            elementArray[i].nativeElement.innerHTML =
              '<div style=" color: #dc7633; transform: translateY(-18%); font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
          }

          // Case วรรณยุกต์ มาก่อน สระอำ
          if ((elementArray[i].nativeElement.innerText === "่"      // ถ้า index เท่ากับ ไม้เอก
            || elementArray[i].nativeElement.innerText === "้"     // ไม้โท
            || elementArray[i].nativeElement.innerText === "๊"     // ไม้ตรี
            || elementArray[i].nativeElement.innerText === "๋")     // ไม้จัตวา
            && elementArray[i + 1].nativeElement.innerText === "ำ"   // และ index + 1 คือ สระอำ
          ) {                                                     // ให้เลื่อนสระขึ้นไป 13%
            elementArray[i].nativeElement.innerHTML =
              '<div style=" color: #dc7633; transform: translateY(-18%); font-weight: normal;"> ' + elementArray[i].nativeElement.innerText + ' </div>';
          }

        }

      }
      // elementArray[0].nativeElement.innerHTML = '<div style="color: #dc7633; font-weight: normal;"> ' + elementArray[0].nativeElement.innerText + ' </div>';
      // elementArray[1].nativeElement.innerHTML = '<div style="color: #dc7633; font-weight: normal;"> ' + elementArray[1].nativeElement.innerText + ' </div>';
      // elementArray[2].nativeElement.innerHTML = '<div style="color: #dc7633; font-weight: normal;"> ' + elementArray[2].nativeElement.innerText + ' </div>';
      // elementArray[4].nativeElement.innerHTML = '<div style="color: #dc7633; font-weight: normal;"> ' + elementArray[4].nativeElement.innerText + ' </div>';
      // case วรรณยุกต์ มาก่่อน สระอำ
    }
  }

  //ฟังก์ชันของปุ่มรีเฟรช เอานับถอยหลังออก
  async refresh() {
    this.hl_index = 0;
    if (this._word_spell != '') {
      this._audio = this.media.create(this.file.externalApplicationStorageDirectory + 'Voice/spell/' + this._word_path);
      let limit_: number = 0;
      this._image = this._word_level + '_0';
      this._CheckRefresh_status = true;
      this._refresh_status = true;
      this._spelling_status = false;

      setTimeout(() => {
        this._audio.play();
      }, 10);

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

          setTimeout(() => {

            this.creatText();
          }, 10);

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

              ///เพิ่มส่วนการ Highlight คาดแถบสีบนตัวอักษรหลังการสแกน QR code;
              this.render.setElementClass(this._spelltext._results[index].nativeElement, 'highlight_spelling', true);

              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'opacity', '1');
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'font-size', this._font_size + 'vw');

              ///การ highlight index;

              this.highlightText(this.hl_index);

              setTimeout(() => {
                this.creatText();
                this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'font-size', this._font_size + 'vw');

                /// highlight += 1 ไป highlight คำต่อไป;
                this.hl_index += 1;

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

  //ฟังก์ชันอ่านแจกลูกสะกดคำ
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

          setTimeout(() => {
            this.creatText();
          }, 10);

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

              ///เพิ่มส่วนการ Highlight คาดแถบสีบนตัวอักษรหลังการสแกน QR code;
              this.render.setElementClass(this._spelltext._results[index].nativeElement, 'highlight_spelling', true);

              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'opacity', '1');
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'font-size', this._font_size + 'vw');

              ///การ highlight index;
              this.highlightText(this.hl_index);

              setTimeout(() => {
                this.creatText();
                this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'font-size', this._font_size + 'vw');

                /// highlight += 1 ไป highlight คำต่อไป;
                this.hl_index += 1;

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
}

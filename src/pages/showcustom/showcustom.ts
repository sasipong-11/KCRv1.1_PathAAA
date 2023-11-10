import { Component, ElementRef, Renderer, ViewChild, ViewChildren } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ApiProvider } from '../../providers/api/api';
import { StorageProvider } from '../../providers/storage/storage';
import { ScanPage } from '../scan/scan';
import { StartPage } from '../start/start';

/**
 * Generated class for the ShowcustomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-showcustom',
  templateUrl: 'showcustom.html',
})
export class ShowcustomPage {

  @ViewChildren('spell', { read: ElementRef }) _spelltext;
  //word
  @ViewChildren('spellWord', { read: ElementRef }) _spellWord;
  //
  @ViewChild('cooldown', { read: ElementRef }) _cooldown;


  theme: string = 'default';
  _font_size: number = 6;
  _text_limit: number = 20;

  //แยก set ค่า_font
  _fontWord_size: number = 8;
  _textWord_limit: number = 20;
  //

  _image: string = "blank";
  _image_callout: string = "1_0";
  _state: boolean = false;

  qrData: any;

  _audio: any = null;


  _spelling: any;
  _spelling_time: number = 500; // ms
  _spelling_status: boolean = false;

  // ประกาศ _spellingWord สำหรับใช้ในการเรียกหน้า show.html
  _spellingWord: any;

  _refresh_status: boolean = false;

  _word_spell: string = '';
  _word_name: string = '';
  _word_qrcode: string = '';
  _word_path: string = '';
  _word_level: string = 'p0';

  //เพิ่มการกำหนด index เพื่อ Highlight คำตามตำแหน่งที่ต้องการได้;
  //ตัวอย่าง . กุ้ ง ;
  //index_spell =              0-2-02--02-6-026--026-4-0264;
  //แสดงการ Highlight ตามลำดับ ก--ุ-กุ--กุ-ง-กุง--กุง--้-กุ้ง;

  index_spell: string = '0-1-01--01-3-013--013-2-0123';

  // index_spell: string = '0-2-02-02-3-023-023-1-0123';

  //
  _page: string = 'startpage';
  _scan_status: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private nativePageTransitions: NativePageTransitions,
    private apiPro: ApiProvider,
    private loadCtrl: LoadingController,
    private storage: StorageProvider,
    private render: Renderer) {

    this._spelling = Array();
    //spellword
    this._spellingWord = Array();
    //
    this.storage.fetch();
    this._page = this.navParams.get('page');
    this.theme = this.storage.getLevel();
  }

  ionViewDidLoad() {
    // data for test
    // this.qrData = "PLMw9IDwwK7owKOwLTLMRfLx/H4oLA1f";          // ข้าว
    this.qrData = "rn28+sARIBi67YKbxMDSse4RYwmWTMVF";          // กุ้ง
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

  }

  ionViewWillEnter() {
    this.qrData = this.qrData == undefined ? this.navParams.get('qrData') : this.qrData;
    if (this.qrData != null) {
      // this._state = true;
      if (this.platform.is('android') || this.platform.is('ios')) {
        // set to Orientation
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
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
    console.log('this.qrData :' + this.qrData);

    await this.apiPro.getQrData(param).then(response => {
      console.log('status :' + response["status"]);
      if (response["status"] == true) {
        this._state = true;
        this._word_name = response["word_name"]; console.log("name : " + this._word_name);
        this._word_spell = response["word_spell"]; console.log("spell : " + this._word_spell);
        this._word_qrcode = response["word_code"]; console.log("qrcode : " + this._word_qrcode);
        this._word_path = response["word_path"]; console.log("path : " + this._word_path);
        this._word_level = response["word_level"]; console.log("level : " + this._word_level);

        let date: Date = new Date();
        let row = {
          his_id: response["word_id"],
          his_text: response["word_name"],
          his_code: response["word_code"],
          his_spell: response["word_spell"],
          his_level: response["word_level"],
          his_date: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        }

        this.storage.setWord('kdr_tb_history', response["word_id"], row);
        this.theme = this._word_level;
        this.storage.updateLevel(this._word_level);

        this.storage.commit('show');

        this._spelling_time = parseInt(response["word_time"]);
        
        this.spelling();
        this.spellingWord();
      }
      else {
        console.log('else case :');
        this.back();
      }
    }).catch(error => {
      this.back();
      setTimeout(() => {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่ออินเทอร์เน็ต');
      }, 2000);
      console.log('error : ' + error.message);
    });
    loading.dismiss();
  }

  ionViewWillLeave() {
    if (this._audio != null) {
      this._audio.pause();
    }
  }

  async spelling() {
    if (this._word_spell != '') {
      // console.log(this._word_path);
      this._audio = new Audio(this._word_path);
      this._audio.load();

      let limit_: number = 0;
      this._image = this._word_level + '_0';

      this._refresh_status = true;
      this._spelling_status = false;

      setTimeout(() => {
        this._audio.play();
      }, 3300);

      setTimeout(() => {
        this._spelling_status = true;

        // this._word_spell = 'อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-อ-ออ';
        let temp = this._word_spell.split('-'); console.log(" this._word_spell  : " + this._word_spell.split('-'));
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

        if (words_full.length <= 40) {
          this._font_size = 6;
          this._text_limit = 20; //limit 19
        } else if ((words_full.length > 40) && (words_full.length <= 60)) {
          this._font_size = 5;
          this._text_limit = 25; //limit 24
        } else {
          this._font_size = 3;
          this._text_limit = 28; //limit 27
        }

        let index = 0, s = 1;
        this._spelling = Array();
        for (let i in words) {
          limit_ += words[i].length;
          this._spelling.push({
            value: words[i],
            br: limit_ >= this._text_limit ? true : false,
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
              ///เพิ่มส่วนการ Highlight คาดแถบสีบนตัวอักษรหลังการสแกน QR code
              this.render.setElementClass(this._spelltext._results[index].nativeElement, 'highlight_spelling', true);
              ///
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'opacity', '1');
              this.render.setElementStyle(this._spelltext._results[index].nativeElement, 'font-size', this._font_size + 'vw');
              setTimeout(() => {
                this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'font-size', this._font_size + 'vw');
                if (index != words.length) {
                  this.render.setElementStyle(this._spelltext._results[index_].nativeElement, 'opacity', '0');
                }
              }, this._spelling_time);
              console.log('this._spelling[index].value =' + this._spelling[index].value);
            }
            index += 1;
          }, time);
          time += this._spelling_time;
        }
      }, 3400);
    }
  }

  /// เพิ่มฟังก์ชันใหม่ในการทำงาน Highlight คำศัพท์หลักของคำอ่านแบบแจกลูกสะกดคำ
  async spellingWord() {
    if (this._word_name != '') {
      // console.log(this._word_path);
      this._image = this._word_level + '_0';
      this._refresh_status = true;
      this._spelling_status = false;
      setTimeout(() => {
        this._spelling_status = true;
        // ex. this._word_name = ' กล้วย ';
        let str = this._word_name.split('');
        let time = this._spelling_time;
        let words_full = '';
        let words = Array();
        for (let i in str) {
          if (parseInt(i) > 0) {
            words.push(' ')
            words_full += ' ';
          }
          if (str[i] != "") {
            words_full += str[i];
            words.push(str[i]);
          }
        }
        console.log(" _word_name // words : " + words);

        console.log('str first :' + str.length);
        //set  Array() ของ index _highlight;
        let index = this.index_spell.split('-');
        let index_highlight = Array();
        for (let i in index) {
          if (parseInt(i) > 0) {
          }
          if (index[i] != "") {
            index_highlight.push(index[i]);

          }
        } console.log("index_highlight =" + index_highlight);

        let index_2 = 0, s2 = 1;
        this._spellingWord = Array();
        // เพิ่ม loop for ในการ Highlight ตามตำแหน่ง index ที่กำหนด;
        for (let i = 0; i < index_highlight.length; i++) {
          const index_v = index_highlight[i];
          let word_index_c = Array();
          let index_c = index_v.split('');
          for (let i in index_c) {
            if (parseInt(i) > 0) {

            }
            if (index_c[i] != "") {
              word_index_c.push(index_c[i]);
            }
          }
          for (let j = 0; j < word_index_c.length; j++) {
            var spilt_index = word_index_c[j];
            console.log("index_v =" + index_v);
            console.log("index_c =" + index_c);
            console.log("word_index_c : Array() =" + word_index_c)
            console.log("spilt_index =" + spilt_index);
            ///
            this._spellingWord.push({
              value: str[spilt_index],
              status: false
            });
            ///
          }
        }
        setTimeout(() => {
          let index_2_ = spilt_index;
          if ((index_2 == 0) && (this._word_path != '')) {
          } else {
            setTimeout(() => {
              this._spellingWord[index_2_ - 1].status = false;
            }, 400);
            this._image = this._word_level + '_' + s2;
            s2 = s2 == 3 ? 1 : s2 + 1;
          }
          if ((index_2 + 1) == words.length) {
            this._refresh_status = false;
            this._image = this._word_level + '_0';
          }
          ///เช็คคำ
          ///
          if (this._spellingWord[spilt_index].value) {
            this._spellingWord[spilt_index].status = true;
            this.render.setElementClass(this._spellWord._results[spilt_index].nativeElement, 'color_word', true);
            this.render.setElementStyle(this._spellWord._results[spilt_index].nativeElement, 'opacity', '1');
            this.render.setElementStyle(this._spellWord._results[spilt_index].nativeElement, 'font-size', this._fontWord_size + 'vw');
            setTimeout(() => {
              this.render.setElementStyle(this._spellWord._results[index_2_].nativeElement, 'font-size', this._fontWord_size + 'vw');
              if (index_2 != words.length) {
                this.render.setElementStyle(this._spellWord._results[index_2_].nativeElement, 'opacity', '1');
              }
            }, this._spelling_time);
            console.log('this._spellingWord[split_index].value :' + this._spellingWord[spilt_index].value);
          } index_2++
        }, time);
        time += this._spelling_time;
      }, 3400);
    }
  }

}

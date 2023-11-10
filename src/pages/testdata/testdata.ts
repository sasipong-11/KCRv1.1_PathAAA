import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file/index';
import { SqliteProvider } from '../../providers/sqlite/sqlite';
import { Media, MediaObject } from '@ionic-native/media';

/**
 * Generated class for the TestdataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testdata',
  templateUrl: 'testdata.html',
})


export class TestdataPage {

  _audio: MediaObject = null;
  public i = 1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public file:File,
    private sqlPro: SqliteProvider,
    private media: Media,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestdataPage');
  }

  voiceFile: String;
  voiceId: String ;


  // async testVoiceFile() {

    // for (let i = 1; i <= 600; i++){

      // await this.sqlPro.testVoiceFile(i).then(async (res) => {

        // this.file.checkFile(this.file.externalApplicationStorageDirectory + 'Voice/word/', this.sqlPro.row_data[0].word_voice)
        //   .then(_ => {
        //     console.log(this.sqlPro.row_data[0].word_voice + ' exists');
        //     this.voiceFile = this.sqlPro.row_data[0].word_voice + ' exists' ;
        //   })
        //   .catch(err => {
        //     console.warn(this.sqlPro.row_data[0].word_voice + ' doesnt exist');
        //     this.voiceFile = this.sqlPro.row_data[0].word_voice + ' doesnt exist';
        //     alert(this.sqlPro.row_data[0].word_voice + ' doesnt exist');
        //   });


      // }).catch(error => {
      //   setTimeout(() => {
      //     alert('เกิดข้อผิดพลาด');
      //   }, 2000);
      // });

    // }

  // }



   playAudio(i) {
    setTimeout( () => {
     this.sqlPro.testVoiceFile(i).then((res) => {

      this._audio = this.media.create(this.file.externalApplicationStorageDirectory + 'Voice/word/'+ this.sqlPro.row_data[0].word_voice);


          this._audio.play();
          this.voiceFile = this.sqlPro.row_data[0].word_name;
          this.voiceId = this.sqlPro.row_data[0].word_id;


      }).catch(error => {
        setTimeout(() => {
          alert('เกิดข้อผิดพลาด');
        }, 2000);
      });

      i++;

      if (i <= 600) {
        this.playAudio(i);
      }

    }, 1000);
    this._audio.release();

  }

}

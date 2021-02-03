import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { StorageProvider } from '../../providers/storage/storage';
import { ShowPage } from '../show/show';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ShowofflinePage } from '../showoffline/showoffline';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  theme: string = 'default';

  historyData: any;
  sortHistory: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: StorageProvider,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private nativePageTransitions: NativePageTransitions,
    public alertController: AlertController

    ) {

    this.historyData = Array();
    this.sortHistory = Array();

  }

  showofflinePage: ShowofflinePage

  ionViewWillEnter() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      // set to Orientation
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
    this.getData();
  }

  async getData() {
    await this.storage.fetch();
    this.theme = this.storage.getLevel();
    this.historyData = Array();
    this.historyData = await this.storage.get('kdr_tb_history');

    //สลับตำแหน่งของอาเรย์เอาลำดับสุดท้ายมาไว้ลำดับแรกเพื่อเรียงลำดับการแสกน อันไหนแสกนล่าสุดแสดงไว้บนสุด
    this.sortHistory = Array();
    for(let i=this.historyData.length-1 ; i>=0 ; i-- ){
      this.sortHistory.push(this.historyData[i]);
    }
  }

  goShow(index: number = 0) {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      slowdownfactor: -1,
      slidePixels: 20
    };
    this.nativePageTransitions.slide(options);



    this.navCtrl.push(ShowofflinePage,
      {
        qrData: this.sortHistory[index]["his_code"],
        page: 'historypage'
      });
  }

  // Clear() {
  //   this.storage.ClearHistory('kdr_tb_history');
  //   this.historyData = this.storage.get('kdr_tb_history');
  // }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      title: 'ลบทั้งหมด',
      cssClass: this.theme,
      message: 'ต้องการลบประวัติการใช้ทั้งหมดหรือไม่',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ตกลง',
          handler: () => {
            this.storage.ClearHistory('kdr_tb_history');
            this.historyData = this.storage.get('kdr_tb_history');
            this.sortHistory = this.historyData;
           }
        }
      ]
    });

    await alert.present();
  }


  async Delete(Index){
    this.sortHistory = this.sortHistory.filter(i => i.his_code != Index.his_code);
    this.storage.DeleteHistory(this.sortHistory);
  }

}

import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  AlertController,
  FabContainer
} from 'ionic-angular';

import { HistoryPage } from '../history/history';
import { ShowPage } from '../show/show';
import { StorageProvider } from '../../providers/storage/storage';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ApiProvider } from '../../providers/api/api';
import { ShowofflinePage } from '../showoffline/showoffline';
import { ActivationPage } from '../activation/activation';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file/index';
import { catchError } from 'rxjs/operators';




@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  theme: string = 'default';
  APP_name = '';
  currDate: Date = new Date();
  expireDate: Date = new Date();
  expire: string = '';
  deviceID: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: StorageProvider,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    public alertController: AlertController,
    private apiPro: ApiProvider,
    public storageDevice: Storage,
    private document: DocumentViewer,
    private fileOpener: FileOpener,
    public file: File) {

  }

  ionViewDidLoad() {

    this.file.checkFile(this.file.externalApplicationStorageDirectory, 'KCR_Voice.zip')
      .then(_ => {
        console.log('File exists')

        this.file.removeFile(this.file.externalApplicationStorageDirectory, 'KCR_Voice.zip')
        .then(re => console.warn('Useless zip file deleted.'));

      })
    .catch(async err => {
      console.log('Directory doesnt exist');
  });

  }

  async ionViewWillEnter() {
    // if (this.platform.is('android') || this.platform.is('ios')) {
    //   // set to Orientation
    //   this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    // }

    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      })
    }
    await this.storage.fetch();
    this.APP_name = this.storage.getDBName();
    this.theme = this.storage.getLevel();
  }

  async goExpire() {
    await this.apiPro.getExpireDate().then(response => {
      if (response["status"] == true) {
        this.expireDate = new Date(response["expire_date"]);
      }
    }).catch(error => {
      setTimeout(() => {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่ออินเทอร์เน็ต');
      }, 2000);
    });

  }

  presentAlertExpireApp() {
    const alert = this.alertController.create({
      title: 'แจ้งเตือน',
      message: 'หมดอายุ ไม่สามารถใช้งานได้',
      buttons: [{
        text: 'ตกลง',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }]
    });
    alert.present();
  }

  async goScan() {
    this.navCtrl.push(ShowofflinePage,
      {
        qrData: null,
        page: 'startpage'
      });
  }

  async goHistory() {
    this.navCtrl.push(HistoryPage);
  }

  async goCancelRegis(fab: FabContainer) {
    fab.close();

    const alert = await this.alertController.create({
      title: 'ยกเลิกรหัสการใช้งาน',
      cssClass:  this.theme ,
      message: '  หากยกเลิกรหัสคุณจะไม่สามารถใช้งานแอปพลิเคชันบนอุปกรณ์นี้ได้ จนกว่าจะใส่รหัสเปิดใช้งานอีกครั้ง',
      buttons: [
        {
          text: 'ไม่',
          role: 'cancel',
          cssClass: this.theme,
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ใช่',
          cssClass: this.theme,
          handler: () => {
            console.log('Confirm Okay');
            this.cancelRegis();
          }
        }
      ]
    });
    await alert.present();

  }

  async cancelRegis() {
    //call service use deviceID
    let param = new FormData();
    this.storage.clearLevel();
    this.deviceID = await this.storageDevice.get('deviceID');
    param.append("mac", this.deviceID);
    param.append("act", "N");
    param.append("keyNum", "");
    console.log('macCanCel', this.deviceID);

    this.apiPro.getActivateData(param).then(response => {
      if (response["msg"] == 'OK') {
        this.storageDevice.set('registered', null);
        this.storageDevice.set('downloaded', null);
        this.navCtrl.push(ActivationPage);
        this.navCtrl.setRoot(ActivationPage);
        // console.log('macccc', response["mac"]);
        console.log('msgCancel', response["msg"]);
      }
      else {
        alert('เกิดข้อผิดพลาด');
      }
    }).catch(error => {
      setTimeout(() => {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่ออินเตอร์เน็ต');
      }, 1000);
    });
  }

  async goViewDocument(fab: FabContainer) {

    fab.close();

    await this.file.checkFile(this.file.externalApplicationStorageDirectory, 'document.pdf')
    .then(_ => console.log('File exists'))
    .catch(async err => {
      console.log('Directory doesnt exist');

      await this.file.copyFile(this.file.applicationDirectory + 'www/assets/', 'document.pdf', this.file.externalApplicationStorageDirectory, 'document.pdf')
      .then(data => {
        console.log(" file copied ")
      })
      .catch(err => {
      })

  });

  let savePath = this.file.externalApplicationStorageDirectory + 'document.pdf';

   await this.fileOpener.open(savePath, 'application/pdf')
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));

  }


}

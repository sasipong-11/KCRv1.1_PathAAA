import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  AlertController
} from 'ionic-angular';

import { StartPage } from '../start/start';
import { StorageProvider } from '../../providers/storage/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { ApiProvider } from '../../providers/api/api';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DownloadPage } from '../download/download';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {
  theme: string = 'default';
  APP_name = '';
  inputKey: string;
  outputKey: string;
  deviceID: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: StorageProvider,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    public alertController: AlertController,
    private apiPro: ApiProvider,
    public toastController: ToastController,
    private uniqueDeviceID: UniqueDeviceID,
    public storageDevice: Storage) {

    //data for test
    //this.inputKey = "QDPM0GFE608JW3026BJ100000";

  }

  async ionViewWillEnter() {
    // if (this.platform.is('android') || this.platform.is('ios')) {
    //   // set to Orientation
    //   this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    //   // window.screen.orientation.lock('portrait');
    // }

    /**Debug Orientation not support on this device. */
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      })
    }
    await this.storage.fetch();
    this.APP_name = this.storage.getDBName();
    this.checkDeviceID();
  }

  async checkDeviceID() {
    /** Get Unique Device ID */
    if (this.platform.is('cordova')) {
      await this.uniqueDeviceID.get()
        .then((uuid: string) => {
          this.deviceID = uuid;
          console.warn('Device ID is : ' + this.deviceID);
          this.storageDevice.set('deviceID', this.deviceID);
        })
        .catch(async (error: any) => {

          // Show alert เมื่อผู้ใช้ปฏิเสธ permission
          console.warn('permission denied !');
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            message: 'อนุญาตการโทรเพื่อเข้าถึง<strong> Device ID </strong>',
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'ตกลง',
                handler: () => {
                  console.log('Confirm Okay');
                  this.checkDeviceID();
                }
              }
            ]
          });
          await alert.present();
        });
    }
  }

  async goDownload() {    // ปุ่มยืนยัน

    let param = new FormData();
    this.deviceID = await this.storageDevice.get('deviceID');
    param.append("mac", this.deviceID);
    param.append("keyNum", this.inputKey);
    param.append("act", "Y");

    if (this.inputKey.length == 25) {    // Key ต้องมี 25 ตัวอักษร
      this.apiPro.getActivateData(param).then(response => {
        if (response["msg"] == 'OK') {
          this.navCtrl.push(DownloadPage);
          this.navCtrl.setRoot(DownloadPage);
          this.storageDevice.set('registered', 'true');
          console.warn('msg', response["msg"]);
          console.warn('Valid Key => Go to Download Page');

        } else if (response["msg"] == 'CHANGE_SERIAL') {
          alert('ลงทะเบียนไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
          console.warn('Invalid Key !');
        } else {
          alert('เกิดข้อผิดพลาด');
        }

      }).catch(error => {
        setTimeout(() => {
          alert('เกิดข้อผิดพลาดในการเชื่อมต่ออินเตอร์เน็ต');
          console.warn('May be Disconnected');
        }, 1000);
      });

    } else {
      alert('กรุณากรอกรหัสให้ครบถ้วน');
      console.warn('About character length');

    }
  }

  goSkip() {
    this.storageDevice.set('registered', 'true');
    this.navCtrl.push(DownloadPage);
    this.navCtrl.setRoot(DownloadPage);
  }

}


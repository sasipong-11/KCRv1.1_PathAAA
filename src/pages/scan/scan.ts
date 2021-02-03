import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';

import { ShowPage } from '../show/show';
import { StartPage } from '../start/start';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { StorageProvider } from '../../providers/storage/storage';
import { StartPage2 } from '../start2/start2';
@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  theme: string = 'default';

  scanSub: any;
  part = 1;

  constructor(public navCtrl: NavController,
    private qrScanner: QRScanner,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public alertController: AlertController,
    private platform: Platform,
    private loadCtrl: LoadingController,
    private storage : StorageProvider,
    private nativePageTransitions: NativePageTransitions) {

    if (this.platform.is('android') || this.platform.is('ios')) {
      // set to Orientation
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }


  }

  ionViewWillEnter() {

    // console.log('ionViewDidLoad ScanPage');
    const loading = this.loadCtrl.create({
      content: "Please wait...",
    });
    loading.present();

    this.theme = this.storage.getLevel();
    setTimeout(() => {
      this.part = 2;
    }, 200);
    this.scan();
    setTimeout(() => {

      loading.dismiss();
    }, 800);
  }
  ionViewWillLeave() {
    this.qrScanner.hide();
    this.hideCamera();/////////////
  }
  async scan() {
    await this.showCamera();///////////
    await this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          console.log('Camera Permission Given');
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {

            this.qrScanner.hide();
            this.scanSub.unsubscribe();
            this.hideCamera();

            // let options: NativeTransitionOptions = {
            //   direction: 'left',
            //   duration: 500,
            //   slowdownfactor: -1,
            //   slidePixels: 20
            // };
            // this.nativePageTransitions.slide(options);
            this.navCtrl.getPrevious().data.qrData = text;
            this.navCtrl.pop();
          });

          this.qrScanner.show();
        } else if (status.denied) {
          console.log('Camera permission denied');
        } else {
          console.log('Permission denied for this runtime.');
        }
      })
      .catch(async (e: any) => {
        console.log('Error is', e);


        // Show alert เมื่อผู้ใช้ปฏิเสธ permission
        console.warn('permission denied !');
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: 'อนุญาตการใช้งานกล้องเพื่อสแกนคิวอาร์โค้ด',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'ตกลง',
              handler: () => {
                console.log('Confirm Okay');
                this.scan();
              }
            }
          ]
        });
        await alert.present();

      });
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }



  back() {
    // if (this.navCtrl.canGoBack()) {
    //   let options: NativeTransitionOptions = {
    //     direction: 'down',
    //     duration: 500,
    //     slowdownfactor: -1,
    //     slidePixels: 20
    //   };
    //   this.nativePageTransitions.slide(options);
    //   this.navCtrl.pop();
    // } else {
      let options: NativeTransitionOptions = {
        direction: 'down',
        duration: 500,
        slowdownfactor: 1,
        slidePixels: 20
      };
      this.nativePageTransitions.slide(options);
      this.navCtrl.setRoot(StartPage);
    // }
  }
}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { TestapiProvider } from '../../providers/testapi/testapi';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  qrData: any;
  result: any;
  scanSub: any;
  constructor(public navCtrl: NavController, private qrScanner: QRScanner,
    private testPro: TestapiProvider) {

  }
  async scan() {
    await this.showCamera();///////////
    await this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          console.log('Camera Permission Given');
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {

            this.qrData = text;
            console.log('Scanned something', this.qrData);
            this.testPro.getQR(text).then(data => {
              this.result = JSON.stringify(data);
              console.log(data);
            }).catch(err => { });

            this.qrScanner.hide();
            this.scanSub.unsubscribe();
            this.hideCamera();/////////////
          });

          this.qrScanner.show();
        } else if (status.denied) {
          console.log('Camera permission denied');
        } else {
          console.log('Permission denied for this runtime.');
        }
      })
      .catch((e: any) => console.log('Error is', e));
    this.qrData = this.qrData;
    this.result = this.result;
  }
  testapi() {
    this.testPro.getQR(this.qrData).then(data => {
      this.result = JSON.stringify(data);
      console.log(data);
    }).catch(err => { })
  }


  ionViewDidLoad() {
    // this.showCamera();
  }
  ionViewWillEnter() {
    this.scan();
  }
  ionViewWillLeave() {
    this.hideCamera();
  }
  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }
  redata() {
    this.qrData = this.qrData;
    this.result = this.result;
  }
}

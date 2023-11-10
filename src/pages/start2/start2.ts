import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  AlertController, LoadingController
} from 'ionic-angular';

import { HistoryPage } from '../history/history';
import { ScanPage } from '../scan/scan';
import { ShowPage } from '../show/show';
import { StartPage } from '../start/start';
import { StorageProvider } from '../../providers/storage/storage';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ApiProvider } from '../../providers/api/api';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ToastController } from 'ionic-angular';
import { c } from '@angular/core/src/render3';
import { Storage } from '@ionic/storage';
import { analyzeAndValidateNgModules } from '@angular/compiler';

import { Zip } from '@ionic-native/zip/index';
import { File } from '@ionic-native/file/index';
import { FilePath } from '@ionic-native/file-path/index';
import { ShowofflinePage } from '../showoffline/showoffline';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { SimpleProgressBarProvider } from 'ionic-progress-bar';




@IonicPage()
@Component({
  selector: 'page-start2',
  templateUrl: 'start2.html',
})
export class StartPage2 {
  [x: string]: any;

  theme: string = 'default';

  APP_name = '';
  currDate: Date = new Date();
  expireDate: Date = new Date();
  expire: string = '';

  inputKey: string;
  outputKey: string;
  progress: any = 0.0;
  _backPressed: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: StorageProvider,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private nativePageTransitions: NativePageTransitions,
    public alertController: AlertController,
    private apiPro: ApiProvider,
    private uniqueDeviceID: UniqueDeviceID,
    private androidPermissions: AndroidPermissions,
    public toastController: ToastController,
    public storageDevice: Storage,
    public zip: Zip,
    public filePath: FilePath,
    public file: File,
    private transfer: FileTransfer,
    private loadCtrl: LoadingController,
    private _progressBar: SimpleProgressBarProvider
  ) {


  }



  // ionViewDidLoad() {

  // }


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
    this.theme = this.storage.getLevel();
  }

  async goWeb() {// ปุ่ม ไม่มีรหัส
    this.navCtrl.push(StartPage);
    // this.storageDevice.set('regis','True');   // ปุ่ม ไม่มีรหัส กำหนดให้ regis = true

    // const toast = this.toastController.create({
    //   message: 'regis = True',
    //   duration: 2000
    // });
    // toast.present();

  }



  async goStart() {// ปุ่ม ยืนยัน

    /** Get Input Key */
    this.outputKey = this.inputKey;
    console.log(this.outputKey);
    const toast = this.toastController.create({
      message: 'Key : ' + this.outputKey,
      duration: 2000
    });
    toast.present();
  }

  async goZip() {

    // Create External Application Storage Directory folder.
    await this.file.checkDir(this.file.externalApplicationStorageDirectory, '')
      .then(_ => console.log('Directory exists'))
      .catch(err => {
        console.log('Directory doesnt exist');
        this.file.createDir(this.file.externalApplicationStorageDirectory, '', true);
      }
      );


    // Download Voice File

    // this._progressBar.present("โหลดไฟล์เสียง", 1437).subscribe(                    // แสดง progress bar loading มีค่าทั้งหมด 1437 (ตามจำนวนไฟล์เสียง)
    //   async () => {
    //     for (let i = 2; i <= 1437; i++) {                                            // loop for ตามจำนวนไฟล์เสียง (เสียงที่ 1 ใช้ไฟล์เดียวกันกับ 638)
    //       const fileTransfer: FileTransferObject = this.transfer.create();
    //       let url: any;                                                              // url สำหรับ download file
    //       let savePath: any;                                                         // path สำหรับเก็บไฟล์
    //       let bk: any = null;                                                        // ค่าที่เอาไว้ตรวจสอบ i ตัวที่ error (กรณีอินเตอร์เน็ตหลุด)
    //       let pathCheck: any;                                                        // path สำหรับตรวจสอบไฟล์ที่ถูกดาวน์โหลดแล้ว

    //       // ขั้นตอนการกำหนด path
    //       if (i < 10) {
    //         url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_000' + i + '.m4a';
    //         savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_000' + i + '.m4a';
    //         pathCheck = 'voice_000' + i + '.m4a';
    //       } else if (i >= 10 && i < 100) {
    //         url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_00' + i + '.m4a';
    //         savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_00' + i + '.m4a';
    //         pathCheck = 'voice_00' + i + '.m4a';
    //       } else if (i >= 100 && i < 1000) {
    //         url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_0' + i + '.m4a';
    //         savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_0' + i + '.m4a';
    //         pathCheck = 'voice_0' + i + '.m4a';
    //       } else if (i >= 1000) {
    //         url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_' + i + '.m4a';
    //         savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_' + i + '.m4a';
    //         pathCheck = 'voice_' + i + '.m4a';
    //       }
    //       // ขั้นตอนการเช็คและดาวน์โหลดไฟล์
    //       await this.file.checkFile(this.file.externalApplicationStorageDirectory + "Voice/", pathCheck)    // เช็คไฟล์ภายในเครื่องว่ามีหรือไม่
    //         .then(_ => console.log(pathCheck + ' File exists.'))
    //         .catch(async err => {
    //           console.error(pathCheck + 'File doesnt exist');
    //           // ถ้าไม่มีให้ดาวน์โหลดไฟล์
    //           await fileTransfer.download(url, savePath).then((entry) => {
    //             console.log('download complete: ' + entry.toURL());
    //           }, (error) => {
    //             // ถ้าดาวน์โหลดไม่สำเร็จ ให้ bk = i
    //               console.log(error);
    //               if (i == 64 || i == 625 ) {
    //                 console.warn("ไม่มีไฟล์ในฐานข้อมูล");
    //               } else if(this._progressBar.dismiss) {
    //                 console.warn("Back Pressed !!!");
    //                 bk = i;
    //               } else {
    //                 bk = i;
    //               }
    //           }
    //           );
    //         }
    //         );
    //       if (i == bk) {
    //         // ถ้า bk == i ให้หยุดการทำงาน for loop
    //         this._progressBar.dismiss();
    //         alert("เกิดข้อผิดพลาดในการเชื่อมต่ออินเตอร์เน็ต");
    //         bk = null;
    //         break;
    //       }
    //       this._progressBar.setMilestone("กำลังโหลดไฟล์เสียงที่ " + i + "/1437");          // เพิ่มค่าหลอด progress bar 1 ค่า
    //       if (i == 1437) {
    //         // ถ้าดาวน์โหลดเสร็จสิ้น นำเข้าสู่หน้า StartPage
    //         this._progressBar.dismiss();
    //         this.navCtrl.push(StartPage);
    //       }
    //     }
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );

    // Download Zip

    let loadingzip = this.loadCtrl.create({
      content: 'กำลังโหลดไฟล์zip...'
    });
    loadingzip.present();


    const fileTransfer: FileTransferObject = this.transfer.create();

    //new url 
    let url = 'http://ld.aaa.in.th/kidcanread/word/testzip/KCR_Voice.zip' ;

    //let url = 'http://www.ld.in.th/kidcanread/word/testzip/KCR_Voice.zip';
    
    let savePath = this.file.externalApplicationStorageDirectory + 'KCR_Voice.zip';

    await fileTransfer.download(url, savePath).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      loadingzip.dismiss();
    }, (error) => {

    });

    await fileTransfer.onProgress((progressEvent) => {
      console.log(progressEvent);
      var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.progress = perc;
    });


    // Extract Zip File

    let loadingUnzip = this.loadCtrl.create({
      content: 'กรุณารอสักครู่...'
    });
    loadingUnzip.present();


    const uriZipFile = this.file.externalApplicationStorageDirectory + 'KCR_Voice.zip';      //ตำแหน่งเก็บไฟล์ Data
    console.log("uri = " + uriZipFile);
    await this.filePath.resolveNativePath(uriZipFile)
      .then(async (nativepath) => {

        // alert("Unzipping.");

        console.log("nativepath = " + nativepath);
        await this.zip.unzip(nativepath,
          await this.file.externalApplicationStorageDirectory, (progress) => {

            console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%');

            this.progress = ((progress.loaded / progress.total) * 100);

            if (progress.loaded > progress.total) {
              // loadingUnzip.setContent('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%');
            }
            console.warn(this.progress);

          }).then((result) => {
            if (result === 0) {

              loadingUnzip.dismiss();
              this.navCtrl.push(StartPage);
            }
            else if (result === -1) {
              loadingUnzip.dismiss();
              alert("Unzip Failed.");
            }
          }).catch((e) => { console.log(e); })


      }, (err) => {
        alert(JSON.stringify(err));
      })







  }

  // back() {


  //   this.platform.registerBackButtonAction(() => {

  //     let activeView = this.navCtrl.getActive();

  //     //this will not work in signed version using Lazy load use activeView.id instead
  //     if(activeView.component.name === "HomePage") {

  //         // canGoBack check if these's and view in nav stack
  //         if (this.navCtrl.canGoBack()){
  //           this.navCtrl.pop();
  //         } else {
  //             let alert = this.alertCtrl.create({
  //               title: 'Exit Application?',
  //               message: 'Do you want to exit the application?',
  //               buttons: [
  //                 {
  //                   text: 'Cancel',
  //                   role: 'cancel',
  //                   handler: () => {
  //                     console.log('Cancel clicked');
  //                   }
  //                 },
  //                 {
  //                   text: 'Exit',
  //                   handler: () => {
  //                     console.log('Exit clicked');
  //                   }
  //                 }
  //               ]
  //             });
  //             alert.present();
  //         }
  //     }
  // });

  // }



}


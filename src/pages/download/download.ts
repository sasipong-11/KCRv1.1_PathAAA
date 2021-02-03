import { Component, NgZone, Output } from '@angular/core';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { StorageProvider } from '../../providers/storage/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import { SimpleProgressBarProvider } from 'ionic-progress-bar';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file/index';
import { StartPage } from '../start/start';
import { Zip } from '@ionic-native/zip';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader';


/**
 * Generated class for the DownloadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download',
  templateUrl: 'download.html',
})
export class DownloadPage {
  [x: string]: any;

  theme: string = 'default';
  APP_name = '';

  public loadProgress: number = 0;
  public loadProgress2: number = 0;
  _check_downloadZip : boolean = false;
  _check_extractZip : boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    public alertController: AlertController,
    private transfer: FileTransfer,
    // private _progressBar: SimpleProgressBarProvider,
    public zip: Zip,
    public file: File,
    public filePath: FilePath,
    public storageDevice: Storage,
    private ng_zone: NgZone,
    private downloader: Downloader) {

  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      document.addEventListener('backbutton', () => {
       if (!this.navCtrl.canGoBack()) {
         this.platform.exitApp()
         return;
       }
       this.navCtrl.pop()
     }, false);
    });
  }

  // ดาวน์โหลดไฟล์ทีละไฟล์  ** ไม่ได้ใช้
  async goDownloadFile() {

  //   this._check_download = true;

  //   var request: DownloadRequest = {
  //     uri: 'http://www.ld.in.th/kidcanread/word/testzip/KCR_Voice.zip',
  //     title: 'MyDownload',
  //     description: '',
  //     mimeType: '',
  //     visibleInDownloadsUi: true,
  //     notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
  //     destinationInExternalFilesDir: {
  //         dirType: 'Download',
  //         subPath: 'MyFile.zip'
  //     }
  // };


  // this.downloader.download(request)
  // .then((location: string) => console.log('File downloaded at:'+location))
  // .catch((error: any) => console.error(error));






//     // Create External Application Storage Directory folder.
//     await this.file.checkDir(this.file.externalApplicationStorageDirectory, '')
//       .then(_ => console.log('Directory exists'))
//       .catch(err => {
//         console.log('Directory doesnt exist');
//         this.file.createDir(this.file.externalApplicationStorageDirectory, '', true);
//       }
//       );


//     // Download Voice File

//     this._progressBar.present("โหลดไฟล์เสียง", 1437).subscribe(                    // แสดง progress bar loading มีค่าทั้งหมด 1437 (ตามจำนวนไฟล์เสียง)

//       async () => {
//         for (let i = 2; i <= 1437; i++) {                                            // loop for ตามจำนวนไฟล์เสียง (เสียงที่ 1 ใช้ไฟล์เดียวกันกับ 638)

//           const fileTransfer: FileTransferObject = this.transfer.create();
//           let url: any;                                                              // url สำหรับ download file
//           let savePath: any;                                                         // path สำหรับเก็บไฟล์
//           let bk: any = null;                                                        // ค่าที่เอาไว้ตรวจสอบ i ตัวที่ error (กรณีอินเตอร์เน็ตหลุด)
//           let fileName: any;                                                        //  ชื่อไฟล์


//           // ขั้นตอนการกำหนด path ตามชื่อไฟล์
//           if (i < 10) {
//             url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_000' + i + '.m4a';
//             savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_000' + i + '.m4a';
//             fileName = 'voice_000' + i + '.m4a';

//           } else if (i >= 10 && i < 100) {
//             url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_00' + i + '.m4a';
//             savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_00' + i + '.m4a';
//             fileName = 'voice_00' + i + '.m4a';

//           } else if (i >= 100 && i < 1000) {
//             url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_0' + i + '.m4a';
//             savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_0' + i + '.m4a';
//             fileName = 'voice_0' + i + '.m4a';

//           } else if (i >= 1000) {
//             url = 'http://www.ld.in.th/kidcanread/word/media/' + i + '/voice_' + i + '.m4a';
//             savePath = this.file.externalApplicationStorageDirectory + "Voice/" + 'voice_' + i + '.m4a';
//             fileName = 'voice_' + i + '.m4a';
//           }

//           // ขั้นตอนการเช็คและดาวน์โหลดไฟล์
//           await this.file.checkFile(this.file.externalApplicationStorageDirectory + "Voice/", fileName)    // เช็คไฟล์ภายในเครื่องว่ามีหรือไม่
//             .then(_ => console.log(fileName + ' File exists.'))
//             .catch(async err => {
//               console.error(fileName + 'File doesnt exist');

//               // ถ้าไฟล์ภายในเครื่องไม่มีให้ดาวน์โหลดไฟล์
//               await fileTransfer.download(url, savePath).then((entry) => {
//                 console.log('download complete: ' + entry.toURL());
//               }, (error) => {

//                 // ถ้าดาวน์โหลดไม่สำเร็จ (อินเตอร์เน็ตหลุด) ให้ bk = i
//                 console.log(error);
//                 if (i == 64 || i == 625) {                    // 2 ไฟล์เสียงไม่มีในฐานข้อมูล (ุ64 = "ทหาร" , 625 = "เอา")
//                   console.warn("ไม่มีไฟล์ในฐานข้อมูล");
//                 } else {
//                   bk = i;
//                 }
//               }
//               );
//             }
//             );

//           if (i == bk) {

//             // ถ้า i == bk ให้หยุดการทำงาน for loop และ ลบไฟล์ที่ดาวน์โหลดผิดพลาด
//             this.file.removeFile(this.file.externalApplicationStorageDirectory + "Voice/", fileName);

//             this._progressBar.dismiss();
//             alert("เกิดข้อผิดพลาดในการเชื่อมต่ออินเตอร์เน็ต");
//             bk = null;
//             break;
//           }

//           this._progressBar.setMilestone("กำลังโหลดไฟล์เสียงที่ " + i + "/1437");          // เพิ่มค่าหลอด progress bar 1 ค่า

//           if (i == 1437) {

//             // ถ้าดาวน์โหลดเสร็จสิ้น นำเข้าสู่หน้า StartPage
//             this._progressBar.dismiss();
//             this.navCtrl.push(StartPage);
//             this.navCtrl.setRoot(StartPage);
//           }
//         }
//       },
//       (err) => {
//         console.error(err);
//       }
//     );

  }

  // แสดงเปอร์เซ็นสำหรับดาวน์โหลดไฟล์
  public on_progress = (progressEvent: ProgressEvent): void => {
    this.ng_zone.run(() => {
        if (progressEvent.lengthComputable) {
            let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            if (progress > 100) progress = 100;
            if (progress < 0) progress = 0;
          this.loadProgress = progress;
          console.log('Downloading => ' + this.loadProgress +'%');

        }
    });
  }

  // ดาวน์โหลดไฟล์แบบ zip
  async goDownloadZip() {

  this._check_downloadZip = true;

  // Create External Application Storage Directory folder.
  await this.file.checkDir(this.file.externalApplicationStorageDirectory, '')
  .then(_ => console.log('Directory exists'))
  .catch(err => {
    console.log('Directory doesnt exist');
    this.file.createDir(this.file.externalApplicationStorageDirectory, '', true);
  });

  // Download Zip
  const fileTransfer: FileTransferObject = this.transfer.create();
  let url = 'http://www.ld.in.th/kidcanread/word/testzip/KCR_Voice.zip' ;
  let savePath = this.file.externalApplicationStorageDirectory + 'KCR_Voice.zip' ;
  fileTransfer.download(url, savePath).then((entry) => {
    // console.log('download complete: ' + entry.toURL());
    this._check_downloadZip = false;
    console.warn('Download complete.');

    this.extractZip();

  }, (error) => {
    this._check_downloadZip = false;
    this.loadProgress = 0;
    alert("มีปัญหาในการเชื่อมต่ออินเตอร์เน็ต");
    console.warn('Disconnected.');
  });
    fileTransfer.onProgress(this.on_progress);
  }

  // แยกไฟล์ zip ที่ดาวน์โหลด
  async extractZip() {
  this._check_extractZip = true;

  const uriZipFile = this.file.externalApplicationStorageDirectory + 'KCR_Voice.zip';      //ตำแหน่งเก็บไฟล์ zip
  console.log("uri = " + uriZipFile);

  this.filePath.resolveNativePath(uriZipFile)
    .then(async (nativepath) => {
      console.log("nativepath = " + nativepath);
      this.zip.unzip(nativepath,
        this.file.externalApplicationStorageDirectory,
        (progress): void => {
          this.ng_zone.run(() => {
            let progress2 = Math.round((progress.loaded / progress.total) * 100);
            if (progress2 > 100) progress2 = 100;
            if (progress2 < 0) progress2 = 0;
            this.loadProgress2 = progress2;
            console.log('Extracting => ' + this.loadProgress2 +'%');
          });
        }
      ).then((result) => {
        if (result === 0) {
          console.warn('Extract complete');
          console.warn('Go to Start Page');

          this.navCtrl.push(StartPage);
          this.navCtrl.setRoot(StartPage);
          this.storageDevice.set('downloaded', 'true');
        }else if(result === -1){
          alert("พบปัญหาในการแยกไฟล์เสียง");
        }
      }).catch((e) => { console.log(e); })
    }, async (err) => {

      // แสดง alert เมื่อผู้ใช้ไม่อนุญาต permission
      console.warn('permission denied !');
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        message: 'อนุญาตการเข้าถึงไฟล์เพื่อจัดเก็บไฟล์เสียง',
        enableBackdropDismiss: false,
        buttons: [
         {
            text: 'ตกลง',
            handler: () => {
              console.log('Confirm Okay');
              this.extractZip();
            }
          }
        ]
      });
      await alert.present();
    })
  }

}

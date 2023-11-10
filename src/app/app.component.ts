import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';//25/09/2020
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { StartPage2 } from '../pages/start2/start2';
import { StartPage } from '../pages/start/start';
import { ShowPage } from '../pages/show/show';
import { ApiProvider } from '../providers/api/api';
import { ActivationPage } from '../pages/activation/activation';
import { DownloadPage } from '../pages/download/download';
import { ShowofflinePage } from '../pages/showoffline/showoffline';
import { TestdataPage } from '../pages/testdata/testdata';
import { ShowcustomPage } from '../pages/showcustom/showcustom';
import { ShowofflineV2Page } from '../pages/showoffline-v2/showoffline-v2';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // rootPage: any = TestdataPage;
  //rootPage: any = ShowofflineV2Page;

  // rootPage: any = DownloadPage;

  rootPage: any;
  hasKey: boolean = false;
  deviceID: string;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    mobileAccessibility: MobileAccessibility,
    private uniqueDeviceID: UniqueDeviceID,
    public toastController: ToastController,
    public alertController: AlertController,
    public storageDevice: Storage) {

    platform.ready().then(async () => {

      if (mobileAccessibility) {//25/09/2020 solve problem :  Font size difference caused by Android font size settings
        mobileAccessibility.usePreferredTextZoom(false);
      }

      statusBar.hide();
      splashScreen.hide();

      // // ตรวจสอบตัวแปร Shared Preference เพื่อสลับหน้าแรกของแอปพลิเคชัน

      if (await storageDevice.get('registered') == 'true'
        && await storageDevice.get('downloaded') == null) {

        // กรณีที่ลงทะเบียนสำเร็จแต่ดาวน์โหลดไม่สำเร็จ
        this.rootPage = DownloadPage;
        console.warn("Registered ! but download not finished. => Go to Download Page.");

      } else if (await storageDevice.get('registered') == 'true'
        && await storageDevice.get('downloaded') == 'true') {

        // กรณีที่ลงทะเบียนสำเร็จและดาวน์โหลดสำเร็จ
        this.rootPage = StartPage;
        console.warn("Downloaded ! => Go to Start Page");
      } else {
        // กรณีที่ยังไม่ได้ลงทะเบียน
        this.rootPage = ActivationPage;
        console.warn("Not registered yet ! => Go to Activation Page");
      }


    });
  }

}


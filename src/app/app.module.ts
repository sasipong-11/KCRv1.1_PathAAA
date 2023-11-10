import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HistoryPage } from '../pages/history/history';
import { ScanPage } from '../pages/scan/scan';
import { ShowPage } from '../pages/show/show';
import { StartPage } from '../pages/start/start';



import { QRScanner } from '@ionic-native/qr-scanner';
import { TestapiProvider } from '../providers/testapi/testapi';
import { HttpClientModule } from '@angular/common/http';
import { StorageProvider } from '../providers/storage/storage';
import { IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ApiProvider } from '../providers/api/api';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';//25/09/2020
import { StartPage2 } from '../pages/start2/start2';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { Zip } from '@ionic-native/zip/index';
import { File } from '@ionic-native/file/index';
import { FilePath } from '@ionic-native/file-path/index';
import { Media } from '@ionic-native/media/index';
import { SQLite } from '@ionic-native/sqlite/index';
import { TestsqliteProvider } from '../providers/testsqlite/testsqlite';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';
import { ShowofflinePage } from '../pages/showoffline/showoffline';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { IonicSimpleProgressBarModule, SimpleProgressBarProvider } from 'ionic-progress-bar';
import { DownloadPage } from '../pages/download/download';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { Downloader } from '@ionic-native/downloader/';
import { ActivationPage } from '../pages/activation/activation';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { TestdataPage } from '../pages/testdata/testdata';
import { ShowcustomPage } from '../pages/showcustom/showcustom';
import { ShowofflineV2Page } from '../pages/showoffline-v2/showoffline-v2';

/**Debug Orientation not support on this device. */
class ScreenOrientationMock extends ScreenOrientation {
  lock(type) {
    return new Promise((resolve, reject) => {
      resolve("locked");
    })
  }
}
/**Debug Orientation not support on this device. */

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    ScanPage,
    ShowPage,
    StartPage,
    StartPage2,
    ShowofflinePage,
    DownloadPage,
    ActivationPage,
    ProgressBarComponent,
    TestdataPage,
    ShowcustomPage,
    ShowofflineV2Page
  ],
  imports: [
    BrowserModule,
    PdfViewerModule,
    HttpClientModule,
    // IonicSimpleProgressBarModule.forRoot(),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__kidcanread',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    ScanPage,
    ShowPage,
    StartPage,
    StartPage2,
    ShowofflinePage,
    ActivationPage,
    DownloadPage,
    TestdataPage,
    ShowcustomPage,
    ShowofflineV2Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ScreenOrientation, useClass: ScreenOrientationMock },  //Debug Orientation not support on this device.
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    QRScanner,
    TestapiProvider,
    StorageProvider,
    ScreenOrientation,
    NativePageTransitions,
    ApiProvider,
    MobileAccessibility,
    UniqueDeviceID,
    AndroidPermissions,
    Zip,
    File,
    FilePath,
    Media,
    SQLite,
    TestsqliteProvider,
    SqliteDbCopy,
    SqliteProvider,
    FileTransfer,
    Downloader,
    DocumentViewer,
    FileOpener
    // SimpleProgressBarProvider
  ]
})
export class AppModule { }

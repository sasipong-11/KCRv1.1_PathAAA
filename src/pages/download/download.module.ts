import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';
import { DownloadPage } from './download';

@NgModule({
  declarations: [
    DownloadPage,
    ProgressBarComponent
  ],
  imports: [
    IonicPageModule.forChild(DownloadPage),


  ],
})
export class DownloadPageModule {}

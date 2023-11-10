import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestdataPage } from './testdata';

@NgModule({
  declarations: [
    TestdataPage,
  ],
  imports: [
    IonicPageModule.forChild(TestdataPage),
  ],
})
export class TestdataPageModule {}

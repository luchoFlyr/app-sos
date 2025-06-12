import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraPage } from './camera.page';
import { CameraPageRoutingModule } from './camera-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CameraPageRoutingModule,
    SharedModule,
    TranslateModule 
  ],
  declarations: [CameraPage]
})
export class CameraPageModule { }

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraPage } from './camera.page';
import { CameraPageRoutingModule } from './camera-routing.module';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CameraPageRoutingModule,
    SharedModule
  ],
  declarations: [CameraPage]
})
export class CameraPageModule { }

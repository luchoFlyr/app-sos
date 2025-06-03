import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanicPage } from './panic.page';
import { PanicPageRoutingModule } from './panic-routing.module';

import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { SharedModule } from '../../shared/shared.module';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PanicPageRoutingModule,
    SharedModule
  ],
  declarations: [PanicPage],
  providers: [SMS]
})
export class PanicPageModule { }

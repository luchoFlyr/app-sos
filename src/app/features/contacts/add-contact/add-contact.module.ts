import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContactPageRoutingModule } from './add-contact-routing.module';

import { AddContactPage } from './add-contact.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContactPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [AddContactPage]
})
export class AddContactPageModule { }

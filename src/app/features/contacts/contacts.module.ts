import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactsPage } from './contacts.page';
import { ContactsPageRoutingModule } from './contacts-routing.module';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ContactsPageRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [ContactsPage],
})
export class ContactsPageModule { }

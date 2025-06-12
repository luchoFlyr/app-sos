import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { ContactForm } from 'src/app/core/models/ContactForm.model';
import { ContactService } from 'src/app/core/services/contact.service';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './template/contacts.page.html',
  styleUrls: ['./styles/contacts.page.scss'],
  standalone: false
})
export class ContactsPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private contactService: ContactService,
    private actionSheetController: ActionSheetController,
    private translation: TranslationService
  ) { }

  ngOnInit(): void { }

  get contacts(): ContactForm[] {
    return this.contactService.getAll();
  }

  addEmergencyContact(): void {
    this.contactService.navigateToAddContact({ type: 'Emergencia' });
  }

  async importContacts(): Promise<void> {
    try {
      await this.contactService.importFromDevice();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : this.translation.instant('contacts.importError');
      await this.showAlert(message);
    }
  }

  callContact(contact: ContactForm): void {
    window.open(`tel:${contact.phone}`, '_system');
  }

  editContact(contact: ContactForm, index: number): void {
    this.contactService.navigateToAddContact(contact, index);
  }

  public async openContactOptions(contact: ContactForm, index: number): Promise<void> {
    const sheet = await this.actionSheetController.create({
      header: this.translation.instant('contacts.more.title'),
      buttons: [
        {
          text: this.translation.instant('contacts.more.edit'),
          icon: 'create',
          handler: () => this.editContact(contact, index)
        },
        {
          text: this.translation.instant('contacts.more.delete'),
          icon: 'trash',
          role: 'destructive',
          handler: () => this.deleteContact(index)
        },
        {
          text: this.translation.instant('general.cancel'),
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await sheet.present();
  }

  async deleteContact(index: number): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translation.instant('contacts.deleteTitle'),
      message: this.translation.instant('contacts.deleteMessage'),
      buttons: [
        {
          text: this.translation.instant('general.cancel'),
          role: 'cancel'
        },
        {
          text: this.translation.instant('general.delete'),
          role: 'destructive',
          handler: () => this.contactService.delete(index)
        }
      ]
    });
    await alert.present();
  }

  private async showAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translation.instant('contacts.alertTitle'),
      message,
      buttons: [this.translation.instant('general.ok')]
    });
    await alert.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { ContactForm } from '../../core/models/ContactForm.model';
import { AlertService } from '../../core/services/alert.service';
import { ContactService } from '../../core/services/contact.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './template/contacts.page.html',
  styleUrls: ['./styles/contacts.page.scss'],
  standalone: false
})
export class ContactsPage implements OnInit {

  constructor(
    private alertService: AlertService, 
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private contactService: ContactService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void { }

  get contacts(): ContactForm[] {
    return this.contactService.getAll();
  }

  public addEmergencyContact(): void {
    this.contactService.navigateToAddContact({ type: 'Emergencia' });
  }

  public async importContacts(): Promise<void> {
    try {
      await this.contactService.importFromDevice();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : this.translationService.instant('contacts.importError');
      await this.showAlert(message);
    }
  }

  public callContact(contact: ContactForm): void {
    window.open(`tel:${contact.phone}`, '_system');
  }

  public editContact(contact: ContactForm, index: number): void {
    this.contactService.navigateToAddContact(contact, index);
  }

  public async openContactOptions(contact: ContactForm, index: number): Promise<void> {
    const sheet = await this.actionSheetController.create({
      header: this.translationService.instant('contacts.more.title'),
      buttons: [
        {
          text: this.translationService.instant('contacts.more.edit'),
          icon: 'create',
          handler: () => this.editContact(contact, index)
        },
        {
          text: this.translationService.instant('contacts.more.delete'),
          icon: 'trash',
          role: 'destructive',
          handler: () => this.deleteContact(index)
        },
        {
          text: this.translationService.instant('general.cancel'),
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await sheet.present();
  }

  async deleteContact(index: number): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translationService.instant('contacts.deleteTitle'),
      message: this.translationService.instant('contacts.deleteMessage'),
      buttons: [
        {
          text: this.translationService.instant('general.cancel'),
          role: 'cancel'
        },
        {
          text: this.translationService.instant('general.delete'),
          role: 'destructive',
          handler: () => this.contactService.deleteContact(index)
        }
      ]
    });
    await alert.present();
  }

  private async showAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translationService.instant('contacts.alertTitle'),
      message,
      buttons: [this.translationService.instant('general.ok')]
    });
    await alert.present();
  }
}

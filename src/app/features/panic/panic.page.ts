import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ToastController, Platform } from '@ionic/angular';

import { LocationService } from '../../core/services/location.service';
import { GeocodingService } from '../../core/services/geocoding.service';
import { TranslationService } from '../../core/services/translation.service';
import { SmsService } from '../../core/services/sms.service';
import { ContactService } from '../../core/services/contact.service';
import { ContactForm } from '../../core/models/ContactForm.model';

@Component({
  selector: 'app-panic',
  templateUrl: './template/panic.page.html',
  styleUrls: ['./styles/panic.page.scss'],
  standalone: false
})
export class PanicPage implements OnInit, OnDestroy {

  panicActive = false;
  panicStartTime: number | null = null;
  panicTimer: any = null;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private locationService: LocationService,
    private geocodingService: GeocodingService,
    private translation: TranslationService,
    private smsService: SmsService,
    private contactService: ContactService,
    private platform: Platform
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.clearPanicTimer();
  }

  public togglePanic(): void {
    if (!this.panicActive) {
      this.activatePanic();
    } else {
      this.deactivatePanic();
    }
  }

  private async activatePanic(): Promise<void> {
    this.panicActive = true;
    this.panicStartTime = Date.now();

    const toast = await this.toastController.create({
      message: this.translation.instant('panic.toastActivated'),
      duration: 3000,
      position: 'top',
      color: 'danger',
      buttons: [
        { text: this.translation.instant('general.ok'), role: 'cancel' }
      ]
    });
    await toast.present();

    this.panicTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (this.panicStartTime || 0)) / 1000);
      console.log(`Panic active for ${elapsed} seconds`);
    }, 5000);

    this.sendEmergencyAlert();
  }

  private async deactivatePanic(): Promise<void> {
    this.panicActive = false;
    this.clearPanicTimer();

    const durationSec = this.panicStartTime
      ? Math.floor((Date.now() - this.panicStartTime) / 1000)
      : 0;
    this.panicStartTime = null;

    const alert = await this.alertController.create({
      header: this.translation.instant('panic.alertDeactivatedHeader'),
      message: this.translation.instant('panic.alertDeactivatedMessage', { seconds: durationSec }),
      buttons: [
        {
          text: this.translation.instant('panic.alertDeactivatedWrongBtn'),
          role: 'cancel',
          handler: () => this.sendCancelAlert()
        },
        {
          text: this.translation.instant('panic.alertDeactivatedOkBtn'),
          handler: () => this.sendSafetyConfirmation()
        }
      ]
    });
    await alert.present();
  }

  private clearPanicTimer(): void {
    if (this.panicTimer) {
      clearInterval(this.panicTimer);
      this.panicTimer = null;
    }
  }

  public async shareLocation(): Promise<void> {
    try {
      const { latitude, longitude } = await this.locationService.getCurrentLocation();
      const { formatted } = await this.geocodingService.reverseGeocode(latitude, longitude);
      const mapsLink = this.locationService.getSearchLink(latitude, longitude);

      const alert = await this.alertController.create({
        header: this.translation.instant('panic.shareLocationHeader'),
        message: this.translation.instant(
          'panic.shareLocationMessage',
          {
            coords: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            address: formatted
          }
        ),
        buttons: [
          { text: this.translation.instant('general.cancel'), role: 'cancel' },
          {
            text: this.translation.instant('panic.shareLocationBtn'),
            handler: () => this.sendLocationToContacts(latitude, longitude, mapsLink)
          }
        ]
      });
      await alert.present();

    } catch (err) {
      console.error('Error obteniendo ubicación:', err);
      const alertError = await this.alertController.create({
        header: this.translation.instant('panic.locationErrorHeader'),
        message: this.translation.instant('panic.locationErrorMessage'),
        buttons: [this.translation.instant('general.ok')]
      });
      await alertError.present();
    }
  }

  private async sendEmergencyAlert(): Promise<void> {
    const contacts = this.contactService.getAll();
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);

    if (phoneNumbers.length === 0) {
      const toastNoContacts = await this.toastController.create({
        message: this.translation.instant('panic.noContactsToast'),
        duration: 3000,
        position: 'bottom'
      });
      await toastNoContacts.present();
      return;
    }

    const message = this.translation.instant('panic.smsEmergencyMessage');

    // En Android, enviará silenciosamente. En iOS mostrará toast de “no disponible”
    const sent = await this.smsService.sendSmsSilent(phoneNumbers, message);
    if (sent) {
      const toastOk = await this.toastController.create({
        message: this.translation.instant('panic.smsSentToast', { count: phoneNumbers.length }),
        duration: 3000,
        position: 'bottom',
        color: 'success'
      });
      await toastOk.present();
    }
  }

  private async sendCancelAlert(): Promise<void> {
    const contacts = this.contactService.getAll();
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);
    if (phoneNumbers.length === 0) return;

    const message = this.translation.instant('panic.smsCancelMessage');
    await this.smsService.sendSmsSilent(phoneNumbers, message);
  }

  private async sendSafetyConfirmation(): Promise<void> {
    const contacts = this.contactService.getAll();
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);
    if (phoneNumbers.length === 0) return;

    const message = this.translation.instant('panic.smsSafeMessage');
    await this.smsService.sendSmsSilent(phoneNumbers, message);
  }

  private async sendLocationToContacts(
    latitude: number,
    longitude: number,
    mapsUrl: string
  ): Promise<void> {
    const contacts = this.contactService.getAll();
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);

    if (phoneNumbers.length === 0) {
      const toast = await this.toastController.create({
        message: this.translation.instant('panic.noContactsToast'),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    const message = this.translation.instant('panic.smsLocationMessage', { link: mapsUrl });
    await this.smsService.sendSmsSilent(phoneNumbers, message);
  }
}

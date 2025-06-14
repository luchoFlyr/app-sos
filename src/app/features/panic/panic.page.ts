import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { ContactForm } from '../../core/models/ContactForm.model';
import { ContactService } from '../../core/services/contact.service';
import { GeocodingService } from '../../core/services/geocoding.service';
import { LocationService } from '../../core/services/location.service';
import { SmsService } from '../../core/services/sms.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';



@Component({
  selector: 'app-panic',
  templateUrl: './template/panic.page.html',
  styleUrls: ['./styles/panic.page.scss'],
  standalone: false,
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
    private translationService: TranslationService,
    private smsService: SmsService,
    private contactService: ContactService,
    private toastService: ToastService,

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

  public clearPanicTimer(): void {
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
        header: this.translationService.instant('panic.shareLocationHeader'),
        message: this.translationService.instant(
          'panic.shareLocationMessage',
          {
            coords: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            address: formatted
          }
        ),
        buttons: [
          { text: this.translationService.instant('general.cancel'), role: 'cancel' },
          {
            text: this.translationService.instant('panic.shareLocationBtn'),
            handler: () => this.sendLocationToContacts(latitude, longitude, mapsLink)
          }
        ]
      });
      await alert.present();

    } catch (err) {
      const alertError = await this.alertController.create({
        header: this.translationService.instant('panic.locationErrorHeader'),
        message: this.translationService.instant('panic.locationErrorMessage'),
        buttons: [this.translationService.instant('general.ok')]
      });
      await alertError.present();
    }
  }

  private async activatePanic(): Promise<void> {
    this.panicActive = true;
    this.panicStartTime = Date.now();

    await this.toastService.showToastAsync(
      this.translationService.instant('sms.platformNoSupported'),
      'danger',
      3000,
      'top',
      [{ text: this.translationService.instant('general.ok'), role: 'cancel' }]
    );

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
      header: this.translationService.instant('panic.alertDeactivatedHeader'),
      message: this.translationService.instant('panic.alertDeactivatedMessage', { seconds: durationSec }),
      buttons: [
        {
          text: this.translationService.instant('panic.alertDeactivatedWrongBtn'),
          role: 'cancel',
          handler: () => this.sendCancelAlert()
        },
        {
          text: this.translationService.instant('panic.alertDeactivatedOkBtn'),
          handler: () => this.sendSafetyConfirmation()
        }
      ]
    });
    await alert.present();
  }

  private async sendEmergencyAlert(): Promise<void> {
    const contacts = this.contactService.getAll();
    // const phoneNumbers = contacts.filter((c:ContactForm) => c.allowSms == true).map((c: ContactForm) => c.phone);
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);

    if (phoneNumbers.length === 0) {
      await this.toastService.showToastAsync(this.translationService.instant('panic.noContactsToast'), 'warning', 3000, 'bottom');
      return;
    }

    const message = this.translationService.instant('panic.smsEmergencyMessage');

    const sentSMS = await this.smsService.sendSmsSilentLocal(phoneNumbers, message);
    if (sentSMS) {
      const toastOk = await this.toastController.create({
        message: this.translationService.instant('panic.smsSentToast', { count: phoneNumbers.length }),
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

    const message = this.translationService.instant('panic.smsCancelMessage');
    await this.smsService.sendSmsSilentLocal(phoneNumbers, message);
  }

  private async sendSafetyConfirmation(): Promise<void> {
    const contacts = this.contactService.getAll();
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);
    if (phoneNumbers.length === 0) return;

    const message = this.translationService.instant('panic.smsSafeMessage');
    await this.smsService.sendSmsSilentLocal(phoneNumbers, message);
  }

  private async sendLocationToContacts(
    _latitude: number,
    _longitude: number,
    mapsUrl: string
  ): Promise<void> {
    const contacts = this.contactService.getAll();
    const phoneNumbers = contacts.map((c: ContactForm) => c.phone);

    if (phoneNumbers.length === 0) {
      const toast = await this.toastController.create({
        message: this.translationService.instant('panic.noContactsToast'),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    const message = this.translationService.instant('panic.smsLocationMessage', { link: mapsUrl });
    await this.smsService.sendSmsSilentLocal(phoneNumbers, message);
  }
}


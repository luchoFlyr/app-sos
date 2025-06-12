import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SmsOptions as CordovaSmsOptions, SMS } from '@awesome-cordova-plugins/sms/ngx';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PlatformsEnum } from "../enums/platforms.enum";
import { TextBeltResponse } from '../models/TextBellResponse.model';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})

export class SmsService {
  private readonly TEXT_BELT_URL = '';
  private readonly TEXT_BELT_API_KEY = '';

  constructor(
    private platform: Platform,
    private sms: SMS,
    private http: HttpClient,
    private toastService: ToastService,
    private translationService: TranslationService,

  ) { }

  public async sendSmsSilentLocal(phoneNumbers: string[], message: string): Promise<boolean> {
    if (!this.platform.is(PlatformsEnum.ANDROID)) {
      await this.toastService.showToastAsync(this.translationService.instant('sms.platformNoSupported'), 'warning');
      return false;
    }

    const numbersCsv = phoneNumbers.join(',');

    try {
      const options: CordovaSmsOptions = {
        replaceLineBreaks: false,
        android: {
          intent: ''
        }
      };
      await this.sms.send(numbersCsv, message, options);
      return true;
    } catch (err: any) {
      await this.toastService.showToastAsync(this.translationService.instant('sms.errors.sendSilentSms') + (err.message || err), 'danger');
      return false;
    }
  }

  public async sendSmsViaTextBelt(phoneNumber: string, message: string,): Promise<boolean> {
    try {
      const payload = {
        phone: phoneNumber,
        message,
        key: this.TEXT_BELT_API_KEY
      };
      const response = await firstValueFrom<TextBeltResponse>(
        this.http.post<TextBeltResponse>(this.TEXT_BELT_URL, payload)
      );

      if (response.success) {
        return true;
      } else {
        await this.toastService.showToastAsync(this.translationService.instant('sms.errors.sendAPIsms') + (response.error || 'Unkown'), 'danger');
        return false;
      }
    } catch (err: any) {
      await this.toastService.showToastAsync(this.translationService.instant('sms.errors.sendAPIsms') + (err.message || err), 'danger');
      return false;
    }
  }
}

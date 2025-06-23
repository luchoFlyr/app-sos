import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SmsOptions as CordovaSmsOptions, SMS } from '@awesome-cordova-plugins/sms/ngx';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PlatformsEnum } from "../enums/platforms.enum";
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})

export class SmsService {
  private readonly SMS_API_URL = environment.smsUrlAPI;
  private readonly SMS_API_KEY = environment.smsKeyAPI;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private sms: SMS,
    private toastService: ToastService,
    private translationService: TranslationService,

  ) { }

  public async sendSmsSilentLocal(phoneNumbers: string[], message: string): Promise<boolean> {
    if (!this.platform.is(PlatformsEnum.ANDROID)) {
      await this.toastService.showToastAsync(this.translationService.instant('sms.platformNotSupported'), 'warning');
    }

    const filteredNumbers = phoneNumbers.join(',');

    try {
      const options: CordovaSmsOptions = {
        replaceLineBreaks: false,
        android: {
          intent: ''
        }
      };
      await this.sms.send(filteredNumbers, message, options);
      return true;
    } catch (err: any) {
      await this.toastService.showToastAsync(this.translationService.instant('sms.errors.sendSilentSms') + (err.message || err), 'danger');
      return false;
    }
  }

  public async sendSmsViaAPI(phoneNumbers: string | string[], message: string,): Promise<boolean> {
    try {
      const payload = {
        phone: phoneNumbers,
        message,
        key: this.SMS_API_KEY
      };
      const response = await firstValueFrom<any>(
        this.http.post<any>(this.SMS_API_URL, payload)
      );

      if (response.success) {
        return true;
      } else {
        await this.toastService.showToastAsync(this.translationService.instant('sms.errors.sendAPIsms') + (response.error || 'Unknown'), 'danger');
        return false;
      }
    } catch (err: any) {
      await this.toastService.showToastAsync(this.translationService.instant('sms.errors.sendAPIsms') + (err.message || err), 'danger');
      return false;
    }
  }
}

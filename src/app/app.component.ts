import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { DeviceInfo } from './core/models/DeviceInfo.model';
import { DeviceApiService } from './core/services/device-api.service';
import { DeviceService } from './core/services/device.service';
import { ToastService } from './core/services/toast.service';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  private readonly STORAGE_KEY = 'device';
  private androidDeviceId: string = '';
  public showStatusBar = false;

  constructor(
    private platform: Platform,
    private deviceSvc: DeviceService,
    private deviceApi: DeviceApiService,
    private toastService: ToastService,
    private translationService: TranslationService,
    private alertController: AlertController,
  ) {
  }
  ngOnInit(): void {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready();
    await this.configureStatusBar();
    await this.syncDeviceWithBackend();
  }

  private async configureStatusBar() {
    if (this.showStatusBar) {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.show();
      return;
    }
    await StatusBar.hide();
  }

  private async syncDeviceWithBackend(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      await this.toastService.showToastAsync(this.translationService.instant('general.apiPlatformNotSupported'), 'danger');
      return;
    }

    try {
      this.androidDeviceId = await this.deviceSvc.getDeviceId();

      const existingDevice = await firstValueFrom(
        this.deviceApi.getByAndroidId(this.androidDeviceId)
      );

      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(existingDevice)
      });
    } catch (err: any) {
      if (err.status === 404) {
        await this.registerNewDevice();
      } else {
        console.log(`Error syncing device with backend: ${err.message || err.error}`);
      }
    }
  }

  private async registerNewDevice(): Promise<void> {
    const info: DeviceInfo = await this.deviceSvc.loadInfo();

    const created = await firstValueFrom(
      this.deviceApi.create({
        deviceInfo: {
          DeviceID: this.androidDeviceId,
          NameDevice: info.model
        }
      })
    );

    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(created)
    });
  }
}

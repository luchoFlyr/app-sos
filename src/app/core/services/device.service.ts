import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { DeviceInfo } from '../models/DeviceInfo.model';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private _info: DeviceInfo | null = null;

  public async loadInfo(): Promise<DeviceInfo> {
    if (this._info) {
      return this._info;
    }
    const info = await Device.getId();
    const deviceInfo = await Device.getInfo();

    this._info = {
      uuid: info.identifier,
      model: deviceInfo.model,
      platform: deviceInfo.platform,
      osVersion: deviceInfo.osVersion,
    };

    return this._info;
  }

  public async getDeviceId(): Promise<string> {
    const info = await this.loadInfo();
    return info.uuid;
  }
}

import { Injectable } from '@angular/core';
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';

import { Coordinates } from '../models/Coordinates.model';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private toastService: ToastService,
    private translationService: TranslationService
  ) { }
  private positionOpts: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  };

  public async getCurrentLocation(): Promise<Coordinates> {
    const status = await Geolocation.checkPermissions();
    if (status.location !== 'granted') await Geolocation.requestPermissions();

    const pos: Position = await Geolocation.getCurrentPosition(this.positionOpts);
    const { latitude, longitude, accuracy } = pos.coords;

    if (accuracy > 30) {
      await this.toastService.showToastAsync(this.translationService.instant('location.errors.accuracy'), 'danger');
    }

    return { latitude, longitude, accuracy };
  }

  public getStreetViewLink(lat: number, lon: number): string {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
  }

  public getSearchLink(lat: number, lon: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
}

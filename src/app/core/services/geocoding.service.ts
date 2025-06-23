import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AddressComponents } from '../models/AddressComponent.Model';
import { GeocodeResponse } from '../models/GeoCodeResponse.model';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly baseUrl = `${environment.geoCodingUrl}/${environment.geoCodingSuffix}`;
  private readonly apiKey = environment.geoCodingKey;

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private translationService: TranslationService
  ) { }

  public async reverseGeocode(lat: number, lng: number): Promise<{ formatted: string; components: AddressComponents }> {
    const url = `${this.baseUrl}?latlng=${lat},${lng}&key=${this.apiKey}`;

    let data: GeocodeResponse;
    try {
      data = await firstValueFrom(this.http.get<GeocodeResponse>(url));
    } catch (err: any) {
      await this.toastService.showToastAsync(this.translationService.instant('geocoding.errors.network'), 'danger');
      throw err;
    }

    if (data.status !== 'OK' || data.results.length === 0) {
      await this.toastService.showToastAsync(this.translationService.instant('geocoding.errors.reverseGeocodeError'), 'danger');
    }

    const result = data.results[0];
    const components = this.parseComponents(result.address_components);

    return {
      formatted: result.formatted_address,
      components
    };
  }

  private extract(components: GeocodeResponse['results'][0]['address_components'], type: string): string | undefined {
    const c = components.find(c => c.types.includes(type));
    return c?.long_name || '';
  }

  private parseComponents(geoCodeData: GeocodeResponse['results'][0]['address_components']): AddressComponents {
    let extractData: AddressComponents = {
      streetNumber: this.extract(geoCodeData, 'street_number'),
      route: this.extract(geoCodeData, 'route'),
      locality: this.extract(geoCodeData, 'locality') || this.extract(geoCodeData, 'administrative_area_level_2'),
      administrativeArea: this.extract(geoCodeData, 'administrative_area_level_1'),
      postalCode: this.extract(geoCodeData, 'postal_code'),
      country: this.extract(geoCodeData, 'country')
    }

    return extractData;
  }
}

import { Injectable } from '@angular/core';
import { AddressComponents } from '../models/AddressComponent.Model';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private apiKey = 'AIzaSyC7TBvOu7U6_qgCnvQvhCRvpIReL5QDTVw';

  async reverseGeocode(lat: number, lng: number): Promise<{ formatted: string, components: AddressComponents }> {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' || !data.results.length) {
      throw new Error(`Geocoding error: ${data.status}`);
    }

    const result = data.results[0];
    const comps = result.address_components as any[];

    const get = (type: string) => {
      const obj = comps.find(c => c.types.includes(type));
      return obj ? obj.long_name : undefined;
    };

    const components: AddressComponents = {
      streetNumber: get('street_number'),
      route: get('route'),
      locality: get('locality') || get('administrative_area_level_2'),
      administrativeArea: get('administrative_area_level_1'),
      postalCode: get('postal_code'),
      country: get('country')
    };

    return {
      formatted: result.formatted_address,
      components
    };
  }
}

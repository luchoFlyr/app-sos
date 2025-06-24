import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Device } from '../models/persistence/device.model';
import { ApiService } from './api-service.service';

@Injectable({ providedIn: 'root' })
export class DeviceApiService {
  private base = 'device';

  constructor(private api: ApiService) { }

  public getAll(): Observable<Device[]> {
    return this.api.get<Device[]>(this.base);
  }

  public getById(id: string): Observable<Device> {
    return this.api.get<Device>(`${this.base}/${id}`);
  }

  public getByAndroidId(androidID: string): Observable<Device> {
    console.log("Fetching device by Android ID:", androidID);
    console.log("API Base URL:", this.api.baseUrl);
    console.log("API Base Path:", this.base);
    console.log("API Full URL:", `${this.api.baseUrl}/${this.base}/androidID/${androidID}`);
    
    return this.api.get<Device>(`${this.base}/androidID/${androidID}`);
  }

  public create(device: { deviceInfo: { DeviceID: string; NameDevice: string } }): Observable<Device> {
    console.log("Creating device with info:", JSON.stringify(device));
    console.log("API Base URL:", this.api.baseUrl);
    console.log("API Base Path:", this.base);
    console.log("API Full URL:", `${this.api.baseUrl}/${this.base}`);
    
    return this.api.post<Device, { deviceInfo: { DeviceID: string; NameDevice: string } }>(this.base, device);
  }

  public update(id: string, partial: Partial<{ deviceInfo: { DeviceID: string; NameDevice: string } }>): Observable<Device> {
    return this.api.put<Device, Partial<{ deviceInfo: { DeviceID: string; NameDevice: string } }>>(`${this.base}/${id}`, partial);
  }

  public delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}

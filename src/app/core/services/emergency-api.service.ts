// src/app/core/services/emergency-api.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmergencyPayload, EmergencyResponse } from '../models/persistence/emergency.dto';
import { ApiService } from './api-service.service';

@Injectable({ providedIn: 'root' })
export class EmergencyApiService {
  constructor(private api: ApiService) { }

  public list(deviceId: string): Observable<EmergencyResponse[]> {
    return this.api.get<EmergencyResponse[]>(`emergencies/${deviceId}/emergencies`);
  }

  public create(deviceId: string, emergency: { emergency: EmergencyPayload }): Observable<EmergencyResponse> {
    return this.api.post<EmergencyResponse, { emergency: EmergencyPayload }>(`emergencies/${deviceId}/emergencies`, emergency);
  }

  public update(deviceId: string, emergencyId: string, emergency: { emergency: EmergencyPayload }): Observable<EmergencyResponse> {
    return this.api.put<EmergencyResponse, { emergency: EmergencyPayload }>(`emergencies/${deviceId}/emergencies/${emergencyId}`, emergency);
  }

  public remove(deviceId: string, emergencyId: string): Observable<void> {
    return this.api.delete<void>(`emergencies/${deviceId}/emergencies/${emergencyId}`);
  }
}

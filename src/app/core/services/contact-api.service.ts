import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ContactResponse, ContactPayload } from '../models/persistence/contact.dto';
import { ApiService } from './api-service.service';

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  constructor(private api: ApiService) { }

  public list(deviceId: string): Observable<ContactResponse[]> {
    return this.api.get<ContactResponse[]>(`contacts/${deviceId}/contacts`);
  }

  public create(deviceId: string, contact: { contact: ContactPayload }): Observable<ContactResponse> {
    return this.api.post<ContactResponse, { contact: ContactPayload }>(`contacts/${deviceId}/contacts`, contact);
  }

  public update(deviceId: string, contactId: string, contact: { contact: ContactPayload }): Observable<ContactResponse> {
    return this.api.put<ContactResponse, { contact: ContactPayload }>(`contacts/${deviceId}/contacts/${contactId}`, contact);
  }

  public remove(deviceId: string, contactId: string): Observable<void> {
    return this.api.delete<void>(`contacts/${deviceId}/contacts/${contactId}`);
  }
}

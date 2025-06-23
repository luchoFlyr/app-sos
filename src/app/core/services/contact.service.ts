import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContactPicker } from '@calvinckho/capacitor-contact-picker';
import { Platform } from '@ionic/angular';

import { PlatformsEnum } from '../enums/platforms.enum';
import { ContactForm } from '../models/ContactForm.model';
import { ExtendedContact } from '../models/ExtendedContact';
import { TranslationService } from './translation.service';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private STORAGE_KEY: string = '';
  private contacts: ContactForm[] = [];

  constructor(
    private platform: Platform,
    private router: Router,
    private translation: TranslationService
  ) {
    this.STORAGE_KEY = 'emergency_contacts';
    
    this.loadFromStorage();
  }

  public getAll(): ContactForm[] {
    return [...this.contacts];
  }

  public getContactFromIndex(index: number): ContactForm | null {
    return this.contacts[index] ?? null;
  }

  public addContactData(contact: ContactForm): void {
    this.contacts.push(contact);
    this.saveToStorage();
  }

  public updateContactData(index: number, updated: ContactForm): void {
    if (this.contacts[index]) {
      this.contacts[index] = updated;
      this.saveToStorage();
    }
  }

  public deleteContact(index: number): void {
    if (this.contacts[index]) {
      this.contacts.splice(index, 1);
      this.saveToStorage();
    }
  }

  public navigateToAddContact(prefillData?: Partial<ContactForm>, index?: number): void {
    const queryParams: any = { ...prefillData };
    if (index !== undefined) {
      queryParams.index = index;
    }
    this.router.navigate(['/menu', 'contacts', 'add-contact'], { queryParams });
  }

  public async importFromDevice(): Promise<void> {
    if (!this.platform.is(PlatformsEnum.HYBRID)) {
      throw new Error(
        this.translation.instant('contacts.errors.importUnavailable')
      );
    }

    if (!ContactPicker?.open) {
      throw new Error(
        this.translation.instant('contacts.errors.pluginUnavailable')
      );
    }

    const result = await ContactPicker.open();
    if (!result) {
      return;
    }

    const extCont = result as ExtendedContact;
    const name = extCont.displayName || extCont.fullName;
    const phone = extCont.phoneNumbers?.[0]?.phoneNumber ?? '';

    if (!name || !phone) {
      throw new Error(
        this.translation.instant('contacts.errors.invalidContact')
      );
    }

    const contact: Partial<ContactForm> = {
      name,
      phone,
      type: 'Emergencia'
    };

    this.navigateToAddContact(contact);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.contacts));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.contacts = JSON.parse(stored);
      } catch {
        this.contacts = [];
      }
    }
  }
}

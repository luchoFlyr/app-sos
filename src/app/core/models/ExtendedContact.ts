import type { Contact as CapacitorContact } from '@calvinckho/capacitor-contact-picker';

export interface ExtendedContact extends CapacitorContact {
  displayName?: string;
  givenName?: string;
  familyName?: string;
  phoneNumbers?: { phoneNumber: string }[];
}
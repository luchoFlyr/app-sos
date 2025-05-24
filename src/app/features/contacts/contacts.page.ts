import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { Contact } from "../../core/models/Contact.Model";
import { PlatformsEnum } from '../../core/enums/platforms.enum';
import { ContactPicker } from '@calvinckho/capacitor-contact-picker';
import { ExtendedContact } from 'src/app/core/models/ExtendedContact';

@Component({
  selector: 'app-contacts',
  templateUrl: './template/contacts.page.html',
  styleUrls: ['./styles/contacts.page.scss'],
  standalone: false,
})
export class ContactsPage implements OnInit {

  contacts: Contact[] = [
    {
      name: 'Luis Villalba',
      phone: '3155669183',
      type: 'Emergencia'
    }
  ];

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private platform: Platform
  ) { }

  ngOnInit() { }

  async addEmergencyContact() {
    const alert = await this.alertController.create({
      header: 'Nuevo Contacto de Emergencia',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre completo'
        },
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'Número de teléfono'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.phone) {
              this.contacts.push({
                name: data.name,
                phone: data.phone,
                type: 'Emergencia'
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async importContacts() {
    if (!this.platform.is(PlatformsEnum.HYBRID)) {
      const alert = await this.alertController.create({
        header: 'Solo disponible en dispositivo',
        message: 'La función de importar contactos solo está disponible en un dispositivo físico.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      if (!ContactPicker || !ContactPicker.open) {
        this.showAlert(`ContactPicker plugin no disponible.`);
        throw new Error('ContactPicker plugin no disponible.');
      }

      const contact = await ContactPicker.open();

      if (contact) {
        const extendedContact = contact as ExtendedContact;

        const name = extendedContact.displayName || extendedContact.fullName;
        const phone = extendedContact.phoneNumbers?.[0]?.phoneNumber ?? '';

        if (name && phone) {
          this.contacts.push({
            name,
            phone,
            type: 'Emergencia'
          });
        } else {
          this.showAlert('No se pudo obtener el nombre o número del contacto.');
        }
      } else {
        this.showAlert('No se seleccionó ningún contacto.');
      }

    } catch (error) {
      console.error('Error al importar contacto:', error);
      this.showAlert(`Hubo un error al intentar importar el contacto. Error: ${error}`);
    }
  }


  async callContact(contact: Contact) {
    window.open(`tel:${contact.phone}`, '_system');
  }

  async editContact(contact: Contact, index: number) {
    const alert = await this.alertController.create({
      header: 'Editar Contacto',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: contact.name,
          placeholder: 'Nombre completo'
        },
        {
          name: 'phone',
          type: 'tel',
          value: contact.phone,
          placeholder: 'Número de teléfono'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.phone) {
              this.contacts[index] = {
                ...this.contacts[index],
                name: data.name,
                phone: data.phone
              };
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteContact(index: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar Contacto',
      message: '¿Estás seguro de que quieres eliminar este contacto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.contacts.splice(index, 1);
          }
        }
      ]
    });

    await alert.present();
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Importar Contacto',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

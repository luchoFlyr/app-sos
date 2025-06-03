import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SMS, SmsOptions } from '@awesome-cordova-plugins/sms/ngx';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(
    private platform: Platform,
    private sms: SMS,
    private toastCtrl: ToastController
  ) { }

  /**
   * Envía SMS de forma silenciosa en Android (requiere permiso SEND_SMS).
   * En iOS sólo muestra un toast indicando que no es posible.
   * @param phoneNumbers Array de números (p.ej. ["+573001234567", "3009876543"])
   * @param message Texto del SMS
   */
  public async sendSmsSilent(
    phoneNumbers: string[],
    message: string
  ): Promise<boolean> {
    if (!this.platform.is('android')) {
      await this.showToast(
        'El envío automático de SMS sólo está disponible en Android.',
        'warning'
      );
      return false;
    }

    try {
      // Sólo estas dos propiedades son válidas en SmsOptions:
      const options: SmsOptions = {
        replaceLineBreaks: false,
        android: {
          // cadena vacía => envía silencioso en Android
          intent: ''
        }
      };

      // ¡Atención! Ahora enviamos los parámetros por separado, no dentro de un objeto:
      await this.sms.send(phoneNumbers, message, options);
      return true;
    } catch (err: any) {
      console.error('Error en sendSmsSilent:', err);
      await this.showToast(
        'Error enviando SMS: ' + (err.message || err),
        'danger'
      );
      return false;
    }
  }


  private async showToast(text: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      color
    });
    await toast.present();
  }
}

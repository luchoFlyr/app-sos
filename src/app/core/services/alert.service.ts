import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
  ) { }

  public async showAlertAsync(
    headerText: string,
    messageText: string,
    buttonsAlert: string[] | { text: string, role?: string }[] = ['OK'],
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: buttonsAlert
    });
    await alert.present();
  }
}

import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastCtrl: ToastController
  ) { }

  public async showToastAsync(
    text: string,
    color: 'success' | 'warning' | 'danger' = 'success',
    durationTime: number = 3000,
    toastPosition: 'top' | 'bottom' | 'middle' = 'bottom',
    buttons?: { text: string, role: string, handler?: () => void }[]
  ) {
    const defaultButtons = durationTime === 0 && !buttons ?
      [{ text: 'OK', role: 'cancel' }] : buttons;

    const toast = await this.toastCtrl.create({
      message: text,
      duration: durationTime,
      position: toastPosition,
      color,
      buttons: defaultButtons
    });

    await toast.present();
  }
}

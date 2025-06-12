import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translationService: TranslationService,
  ) { }

  public async showAlertAsync(
    header: string,
    message: string,
    buttons: string[] | { text: string, role?: string }[] = ['OK'],
    cssClass?: string
  ): Promise<void> {

  }
}

import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController } from '@ionic/angular';

import { AddressComponents } from '../../core/models/AddressComponent.Model';
import { UserPhoto } from '../../core/models/UserPhoto.Model';
import { GeocodingService } from '../../core/services/geocoding.service';
import { LocationService } from '../../core/services/location.service';
import { PhotoService } from '../../core/services/photo.service';
import { ShareService } from '../../core/services/share.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-camera',
  templateUrl: './template/camera.page.html',
  styleUrls: ['./styles/camera.page.scss'],
  standalone: false,
})
export class CameraPage implements OnInit {
  public titleComponent: string = '';
  constructor(
    public photoService: PhotoService,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private shareService: ShareService,
    private locationService: LocationService,
    private geocodingService: GeocodingService,
    private translation: TranslationService
  ) { }

  async ngOnInit(): Promise<void> {
    this.setupEvents();
  }

  public async setupEvents(): Promise<void> {
    await this.photoService.loadSaved();
  }

  public getTranslation(key: string): Promise<string> {
    return this.translation.get(key).toPromise();
  }

  public addPhotoToGallery(): void {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones de Foto',
      buttons: [
        {
          text: await this.getTranslation('camera.shareText'),
          icon: 'share-social',
          handler: () => this.sendSharePhotoAction(photo)
        },
        {
          text: await this.getTranslation('camera.deleteText'),
          role: 'destructive',
          icon: 'trash',
          handler: () => this.photoService.deletePicture(photo, position)
        },
        {
          text: await this.getTranslation('camera.cancelText'),
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async sendSharePhotoAction(photo: UserPhoto): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Preparando imagen para compartir...',
      spinner: 'crescent',
      backdropDismiss: false
    });

    try {
      await loading.present();

      const geoData = await this.getGeoLocation();
      const addressText = this.buildAddressText(geoData.components);
      const mapsLink = this.locationService.getStreetViewLink(geoData.latitude, geoData.longitude);

      const textMessage = `¡AYUDA! Estoy en peligro. \n\n${addressText}\n\n📍Mi ubicación: ${mapsLink}`;

      await this.shareService.sharePhoto(photo, textMessage);
    } catch (error) {
      console.error('Error compartiendo foto:', error);
    } finally {
      await loading.dismiss();
    }
  }

  private async getGeoLocation(): Promise<{
    latitude: number;
    longitude: number;
    components: AddressComponents;
  }> {
    const { latitude, longitude } = await this.locationService.getCurrentLocation();
    const { components } = await this.geocodingService.reverseGeocode(latitude, longitude);

    return { latitude, longitude, components };
  }

  private buildAddressText(components: AddressComponents): string {
    const {
      streetNumber,
      route,
      locality,
      administrativeArea,
      postalCode,
      country
    } = components;

    const lines: string[] = [
      `Dirección: ${route ?? ''}${streetNumber ? ' #' + streetNumber : ''}`.trim(),
      `Ciudad - Departamento: ${locality ?? ''}${administrativeArea ? ', ' + administrativeArea : ''}`.trim(),
      `Código postal: ${postalCode ?? ''}`.trim(),
      `País: ${country ?? ''}`
    ];

    return lines.filter(line => line.length).join('\n');
  }
}

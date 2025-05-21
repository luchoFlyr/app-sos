import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../core/services/photo.service';
import { UserPhoto } from 'src/app/core/models/UserPhoto.Model';
import { ShareService } from 'src/app/core/services/share.service';
import { LoadingController } from '@ionic/angular';
import { LocationService } from 'src/app/core/services/location.service';
import { GeocodingService } from 'src/app/core/services/geocoding.service';

@Component({
  selector: 'app-camera',
  templateUrl: './template/camera.page.html',
  styleUrls: ['./styles/camera.page.scss'],
  standalone: false,
})
export class CameraPage implements OnInit {

  constructor(
    public photoService: PhotoService,
    private actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController,
    private shareService: ShareService,
    private locationService: LocationService,
    private geocodingService: GeocodingService,
  ) { }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones de Foto',
      buttons: [
        {
          text: 'Compartir evidencia',
          icon: 'share-social',
          handler: () => this.sendSharePhotoAction(photo)
        },
        {
          text: 'Eliminar evidencia',
          role: 'destructive',
          icon: 'trash',
          handler: () => this.photoService.deletePicture(photo, position)
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async sendSharePhotoAction(photo: UserPhoto) {
    const loading = await this.loadingCtrl.create({
      message: 'Preparando imagen para compartir...',
      spinner: 'crescent',
      backdropDismiss: false
    });

    try {
      await loading.present();

      const { latitude, longitude } = await this.locationService.getCurrentLocation();

      const { components } = await this.geocodingService.reverseGeocode(latitude, longitude);
      const { streetNumber, route, locality, administrativeArea, postalCode, country } = components;

      const addressLines = [
        `${route ?? ''}${streetNumber ? ' #' + streetNumber : ''}`.trim(),
        `${locality ?? ''}${administrativeArea ? ', ' + administrativeArea : ''} ${postalCode ?? ''}`.trim(),
        `${country ?? ''}`
      ].filter(l => l.length);

      const addressText = addressLines.join('\n');
      // const mapsLink = this.locationService.getSearchLink(latitude, longitude);
      const mapsLink = this.locationService.getStreetViewLink(latitude, longitude);

      const textMessage =
        `${addressText}\n\n` +
        `Latitud: ${latitude}\n` +
        `Longitud: ${longitude}\n\n` +
        `${mapsLink}`;

      await this.shareService.sharePhoto(photo, textMessage);

    } finally {
      await loading.dismiss();
    }

  }

  private async shareLocation() {
    const coords = await this.locationService.getCurrentLocation();
    const link = this.locationService.getStreetViewLink(coords.latitude, coords.longitude);
    return link;
  }
}

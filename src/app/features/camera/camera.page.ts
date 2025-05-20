import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../../core/services/photo.service';
import { UserPhoto } from 'src/app/core/models/UserPhoto.Model';
import { ShareService } from 'src/app/core/services/share.service';
import { LoadingController } from '@ionic/angular';

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
    private shareService: ShareService
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
      await this.shareService.sharePhoto(photo);
    } finally {
      await loading.dismiss();
    }
  }

}

import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto } from 'src/app/core/models/UserPhoto.Model';
import { PhotoService } from '../../core/services/photo.service';

@Component({
  selector: 'app-camera',
  templateUrl: './template/camera.page.html',
  styleUrls: ['./styles/camera.page.scss'],
  standalone: false,
})
export class CameraPage {
  constructor(public photoService: PhotoService,
    public actionSheetController: ActionSheetController
  ) { }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Photos',
    buttons: [{
      text: 'Delete',
      role: 'destructive',
      icon: 'trash',
      handler: () => {
        this.photoService.deletePicture(photo, position);
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        // Nothing to do, action sheet is automatically closed
        }
    }]
  });
  await actionSheet.present();
}

}

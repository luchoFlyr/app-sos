import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { UserPhoto } from '../models/UserPhoto.Model';
import { LoadingController, Platform } from '@ionic/angular';
import { PlatformsEnum } from '../enums/platforms.enum';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private readonly PHOTO_STORAGE = 'photos';

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) { }

  public async addNewToGallery(): Promise<void> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedPhoto = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedPhoto);

    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  public async loadSaved(): Promise<void> {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = value ? JSON.parse(value) : [];

    if (!this.platform.is(PlatformsEnum.HYBRID)) {
      this.photos = this.photos.map(p => ({
        ...p,
        webviewPath: p.filepath ? Capacitor.convertFileSrc(p.filepath) : p.webviewPath
      }));
    }
  }

  public async deletePicture(photo: UserPhoto, position: number): Promise<void> {
    this.photos.splice(position, 1);

    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    const filename = this.getFilename(photo.filepath);
    if (filename) {
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
    }
  }

  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const loading = await this.loadingCtrl.create({
      message: '¡Guardando tu evidencia! No tardamos',
      spinner: 'crescent',
      backdropDismiss: false
    });

    await loading.present();

    let fileUri: string;
    const fileName = `${Date.now()}.jpeg`;

    if (this.platform.is(PlatformsEnum.HYBRID)) {
      const fileData = await Filesystem.readFile({ path: photo.path! });

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: fileData.data,
        directory: Directory.Data
      });

      fileUri = savedFile.uri;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      const base64Data = await this.convertBlobToBase64(blob) as string;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data
      });

      fileUri = `${Directory.Data}/${fileName}`;
    }

    await loading.dismiss();

    return {
      filepath: fileUri,
      webviewPath: Capacitor.convertFileSrc(fileUri),
      path: fileUri
    };
  }

  private getFilename(filepath: string): string | null {
    return filepath ? filepath.substring(filepath.lastIndexOf('/') + 1) : null;
  }

  private convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error al convertir imagen a base64'));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}

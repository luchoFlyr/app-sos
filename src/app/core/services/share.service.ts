import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { UserPhoto } from '../models/UserPhoto.Model';

@Injectable({
  providedIn: 'root'
})

export class ShareService {
  public async sharePhoto(photo: UserPhoto): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) {
        await Share.share({
          title: 'Foto de evidencia',
          text: 'Estoy en peligro, mira esta foto.',
          url: photo.webviewPath,
          dialogTitle: 'Compartir foto en...'
        });
      }
      const filePath = photo.path || photo.filepath;
      const file = await Filesystem.readFile({ path: filePath });

      const sharedName = `shared-${Date.now()}.jpg`;
      await Filesystem.writeFile({
        path: sharedName,
        data: file.data,
        directory: Directory.Cache,
        recursive: true
      });

      const uriResult = await Filesystem.getUri({
        directory: Directory.Cache,
        path: sharedName
      });

      await Share.share({
        title: 'Foto de evidencia',
        text: 'Estoy en peligro, mira esta foto.',
        files: [uriResult.uri],
        dialogTitle: 'Compartir foto en...'
      });
    } catch (error) {
      console.error('Error al compartir la foto', error);
    }
  }
}

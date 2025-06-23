import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

import { UserPhoto } from '../models/UserPhoto.Model';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})

export class ShareService {

  constructor(
    private translationService: TranslationService,
    private toastService: ToastService
  ) { }
  public async sharePhoto(photo: UserPhoto, testMessage?: string): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) {
        await Share.share({
          title: this.translationService.instant('share.title'),
          text: this.translationService.instant('share.shareMessage'),
          url: photo.webviewPath,
          dialogTitle: this.translationService.instant('share.subtitle')
        });
      }

      const filePath = photo.path || photo.filepath;
      const file = await Filesystem.readFile({ path: filePath });

      const sharedName = `evidence-${Date.now()}.jpg`;
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
        title: this.translationService.instant('share.title'),
        text: testMessage ? testMessage : this.translationService.instant('share.shareMessage'),
        files: [uriResult.uri],
        dialogTitle: this.translationService.instant('share.subtitle')
      });

    } catch (err) {
      await this.toastService.showToastAsync(this.translationService.instant('share.shareError', { error: err }), 'danger');
    }
  }
}

import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private supportedLanguages = ['es', 'en'];
  private defaultLang = 'es';

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private async initLanguage(): Promise<void> {
    let lang: string | undefined;

    try {
      const info = await Device.getLanguageCode();
      lang = info.value?.split('-')[0];
    } catch (e) {
      lang = this.translate.getBrowserLang();
    }

    const langToUse = this.supportedLanguages.includes(lang!) ? lang! : this.defaultLang;
    this.setLanguage(langToUse);
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  get(key: string) {
    return this.translate.get(key);
  }

  async getAsync(key: string): Promise<string> {
    return await firstValueFrom(this.translate.get(key));
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
  }

  instant(key: string): string {
    return this.translate.instant(key);
  }
}

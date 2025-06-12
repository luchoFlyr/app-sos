import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private supportedLanguages = ['es', 'en'];
  private defaultLang = 'es';

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private async initLanguage() {
    let lang: string | undefined;
    try {
      const info = await Device.getLanguageCode();
      lang = info.value?.split('-')[0];
    } catch (e) {
      lang = this.translate.getBrowserLang() ?? this.defaultLang;
    }
    const langToUse = this.supportedLanguages.includes(lang!) ? lang! : this.defaultLang;
    this.setLanguage(langToUse);
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  public get(key: string) {
    return this.translate.get(key);
  }
  public instant(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
  }
}

import { Component } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  public showStatusBar: boolean = false;
  constructor(private platform: Platform) {
    this.setStatusBarConfig();
  }

  private async setStatusBarConfig() {
    if (this.showStatusBar) {
      this.platform.ready().then(async () => {
        StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.show();
      });
    }

    await StatusBar.hide();
  }
}

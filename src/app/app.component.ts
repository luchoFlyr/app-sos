import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.show();
    });
  }
}

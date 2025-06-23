import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PanicNow',
  webDir: 'www',

  plugins: {
    StatusBar: {
      overlaysWebView: false
      // overlaysWebView: true
    },
    NavigationBar: {
      visible: true
    }
  }
};

export default config;

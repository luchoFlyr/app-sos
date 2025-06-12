import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PanicNow',
  webDir: 'www',

  plugins: {
    StatusBar: {
      overlaysWebView: false
    },
    NavigationBar: {
      visible: true
    }
  }
};

export default config;

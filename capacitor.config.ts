import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mahjongpirates.game',
  appName: 'Mahjong Pirates',
  webDir: '.',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#073b4c'
  }
};

export default config;

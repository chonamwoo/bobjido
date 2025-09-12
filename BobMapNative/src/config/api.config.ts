// API Configuration for different environments
// Automatically detects the best connection method

import { Platform } from 'react-native';

const getApiUrl = () => {
  // For development, you need to update these based on your setup
  const configs = {
    // Your computer's IP on the network (check with ipconfig on Windows)
    lan: 'http://172.20.10.4:8888/api',
    
    // For Android emulator
    androidEmulator: 'http://10.0.2.2:8888/api',
    
    // For iOS simulator  
    iosSimulator: 'http://localhost:8888/api',
    
    // For web browser
    web: 'http://localhost:8888/api',
    
    // For tunnel mode (if you use ngrok or expo tunnel)
    tunnel: 'https://your-tunnel-url.ngrok.io/api',
    
    // Production API
    production: 'https://api.bobmap.com/api'
  };

  // Auto-detect based on platform and environment
  if (__DEV__) {
    if (Platform.OS === 'web') {
      // Web browser can use localhost
      return configs.web;
    } else if (Platform.OS === 'android') {
      // Check if running on emulator or real device
      // For now, default to LAN for real devices
      return configs.lan;
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return configs.iosSimulator;
    }
    // Default for development
    return configs.lan;
  }
  
  // Production
  return configs.production;
};

export const API_URL = getApiUrl();

// Export individual configs for manual override if needed
export const API_CONFIGS = {
  LAN: 'http://172.20.10.4:8888/api',
  ANDROID_EMULATOR: 'http://10.0.2.2:8888/api',
  IOS_SIMULATOR: 'http://localhost:8888/api',
  TUNNEL: 'https://your-tunnel-url.ngrok.io/api',
  PRODUCTION: 'https://api.bobmap.com/api'
};

console.log('API URL configured as:', API_URL);
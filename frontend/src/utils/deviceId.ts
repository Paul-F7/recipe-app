import * as Application from 'expo-application';
import { Platform } from 'react-native';

let cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  try {
    let deviceId: string | null = null;

    if (Platform.OS === 'ios') {
      // iOS: Returns a string uniquely identifying the device for the vendor
      deviceId = await Application.getIosIdForVendorAsync();
    } else if (Platform.OS === 'android') {
      // Android: Returns the Android ID
      deviceId = Application.getAndroidId();
    }

    if (!deviceId) {
      // Fallback for web or if native ID unavailable
      deviceId = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    cachedDeviceId = deviceId;
    return deviceId;
  } catch (error) {
    console.error('Failed to get device ID:', error);
    const fallbackId = `fallback-${Date.now()}`;
    cachedDeviceId = fallbackId;
    return fallbackId;
  }
}

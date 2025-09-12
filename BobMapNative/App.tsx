import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import api from './src/services/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await checkAuthStatus();
    await setupPermissions();
    setIsLoading(false);
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await api.init();
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const setupPermissions = async () => {
    // 위치 권한 요청
    if (Platform.OS !== 'web') {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // 백그라운드 위치 추적 (옵션)
        await Location.requestBackgroundPermissionsAsync();
      }

      // 알림 권한 요청
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus === 'granted') {
        // 테스트 알림 예약
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🍜 BobMap에 오신걸 환영합니다!",
            body: '주변 맛집을 탐색해보세요',
            data: { type: 'welcome' },
          },
          trigger: { seconds: 2 },
        });
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator 
          isAuthenticated={isAuthenticated} 
          userLocation={location}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
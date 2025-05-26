import '@/utils/locationTask';

import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import Toast, { ToastConfig } from 'react-native-toast-message';
import CustomToast from '@/components/CustomToast';
import { setAuthToWebview } from '@/utils/cookie';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { LOCATION_TASK_NAME } from '@/utils/locationTask';

const toastConfig: ToastConfig = {
  success: ({ props }) => <CustomToast {...props} />,
  error: ({ props }) => <CustomToast {...props} />,
};

export default function RootLayout() {
  useEffect(() => {
    setAuthToWebview();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('백그라운드 위치 권한이 필요합니다.');
        return;
      }

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (!hasStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 0,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Momenty 위치 추적 중',
            notificationBody: '앱이 백그라운드에서 위치를 추적하고 있습니다.',
          },
        });
        console.log('[BG] startLocationUpdatesAsync 실행됨');
      }
    })();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: '회원가입', headerShown: false }} />
        <Stack.Screen name="alarm" options={{ title: '알람', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>

      <Toast config={toastConfig} />
    </>
  );
}

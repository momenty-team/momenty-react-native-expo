import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import Toast, { ToastConfig } from 'react-native-toast-message';
import CustomToast from '@/components/CustomToast';
import { setAuthToWebview } from '@/utils/cookie';

const toastConfig: ToastConfig = {
  success: ({ props }) => <CustomToast {...props} />,
  error: ({ props }) => <CustomToast {...props} />,
};

export default function RootLayout() {
  useEffect(() => {
    setAuthToWebview();
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

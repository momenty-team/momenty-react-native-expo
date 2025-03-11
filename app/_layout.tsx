import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React from 'react';
import Toast, { ToastConfig } from 'react-native-toast-message';
import CustomToast from '@/components/CustomToast'; 

const toastConfig: ToastConfig = {
  success: ({ props }) => <CustomToast {...props} />,
  error: ({ props }) => <CustomToast {...props} />,
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SUIT: require('@/assets/fonts/SUIT-Variable.ttf'),
  });

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

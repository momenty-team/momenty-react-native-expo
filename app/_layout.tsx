import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import Toast, { ToastConfig } from 'react-native-toast-message';
import CustomToast from '@/components/CustomToast';
import { getAccessToken, getRefreshToken } from '@/utils/tokenStorage';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import CookieManager from '@react-native-cookies/cookies';

const TOKEN_REFRESH_INTERVAL = 2 * 60 * 1000;

const toastConfig: ToastConfig = {
  success: ({ props }) => <CustomToast {...props} />,
  error: ({ props }) => <CustomToast {...props} />,
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SUIT: require('@/assets/fonts/SUIT-Variable.ttf'),
  });

  useEffect(() => {
    const getCookie = async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken) {
        await CookieManager.set(`${WEBVIEW_BASE_URL}/alarm`, {
          name: 'access_token',
          value: accessToken,
        });
        await CookieManager.set(`${WEBVIEW_BASE_URL}/alarm`, {
          name: 'refresh_token',
          value: refreshToken,
        });
        await CookieManager.set('https://api.momenty.co.kr', {
          name: 'access_token',
          value: accessToken,
        });
        await CookieManager.set('https://api.momenty.co.kr', {
          name: 'refresh_token',
          value: refreshToken,
        });
      }
    };

    getCookie();
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

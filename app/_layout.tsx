import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SUIT: require('../assets/fonts/SUIT-Variable.ttf'),
  });
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: '회원가입', headerShown: false }} />
      <Stack.Screen name="alarm" options={{ title: '알람', headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

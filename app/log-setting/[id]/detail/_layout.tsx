import { Stack } from 'expo-router';

export default function DetailLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[detailId]" options={{ headerShown: false }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';

export default function DetailTypeLayout() {
  return (
    <Stack>
      <Stack.Screen name="[type]" options={{ headerShown: false }} />
    </Stack>
  );
}

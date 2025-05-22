import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack>
      <Stack.Screen name="map" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

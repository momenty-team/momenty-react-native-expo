import { Stack } from 'expo-router';

function CalendarLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default CalendarLayout;

import { Stack } from 'expo-router';

export default function SignupLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="permission" options={{ headerShown: false }} />
      <Stack.Screen name="nickname" options={{ headerShown: false }} />
      <Stack.Screen name="birth" options={{ headerShown: false }} />
      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="explain" options={{ headerShown: false }} />
      <Stack.Screen name="alarm" options={{ headerShown: false }} />
    </Stack>
  );
}

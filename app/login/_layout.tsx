import { Stack } from 'expo-router';

export default function SignupLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="StepPermission" options={{ headerShown: false }} />
      <Stack.Screen name="StepNickName" options={{ headerShown: false }} />
      <Stack.Screen name="StepBirthDay" options={{ headerShown: false }} />
      <Stack.Screen name="StepGender" options={{ headerShown: false }} />
      <Stack.Screen name="StepExplanation" options={{ headerShown: false }} />
      <Stack.Screen name="StepAlarm" options={{ headerShown: false }} />
    </Stack>
  );
}

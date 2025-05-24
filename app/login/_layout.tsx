import { createStackNavigator } from '@react-navigation/stack';

import Login from './index';
import Permission from './permission';
import Nickname from './nickname';
import Birth from './birth';
import Gender from './gender';
import Alarm from './alarm';
import Weight from './weight';
import Height from './height';

import type { LoginParamList } from '@/types';

const Stack = createStackNavigator<LoginParamList>();

function SignupLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={Login} />
      <Stack.Screen name="permission" component={Permission} />
      <Stack.Screen name="nickname" component={Nickname} />
      <Stack.Screen name="birth" component={Birth} />
      <Stack.Screen name="weight" component={Weight} />
      <Stack.Screen name="height" component={Height} />
      <Stack.Screen name="gender" component={Gender} />
      <Stack.Screen name="alarm" component={Alarm} />
    </Stack.Navigator>
  );
}

export default SignupLayout;

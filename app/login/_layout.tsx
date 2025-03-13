import { createStackNavigator } from '@react-navigation/stack';

import Login from './index';
import Permission from './permission';
import Nickname from './nickname';
import Birth from './birth';
import Gender from './gender';
import Explain from './explain';
import Alarm from './alarm';
import { ParamList } from '@/types';

const Stack = createStackNavigator<ParamList>();

function SignupLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={Login} />
      <Stack.Screen name="permission" component={Permission} />
      <Stack.Screen name="nickname" component={Nickname} />
      <Stack.Screen name="birth" component={Birth} />
      <Stack.Screen name="gender" component={Gender} />
      <Stack.Screen name="explain" component={Explain} />
      <Stack.Screen name="alarm" component={Alarm} />
    </Stack.Navigator>
  );
}

export default SignupLayout;

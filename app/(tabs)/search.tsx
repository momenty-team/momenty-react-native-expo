import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import WarnIcon from '@/assets/svg/WarnIcon';
import CheckIcon from '@/assets/svg/CheckIcon';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function Search() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    // 알림 권한 요청 및 Expo Push Token 가져오기
    requestNotificationPermissions().then((status) => {
      setPermissionStatus(status);
    });

    getExpoPushToken().then((token) => {
      if (token) {
        setExpoPushToken(token);
        console.log('Expo Push Token:', token);
      }
    });

    // Foreground에서 알림을 받을 때 실행되는 리스너
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 알림 수신:', notification);
      Alert.alert(
        notification.request.content.title || '알림',
        notification.request.content.body || '새로운 알림이 도착했습니다!'
      );
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="성공 토스트"
        onPress={() => {
          showSuccessToast();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />
      <Button
        title="오류 토스트"
        onPress={() => {
          showErrorToast();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }}
      />
      <Text style={styles.text}>Search</Text>

      {/* 푸시 알림 상태 출력 */}
      <Text>Expo Push Token:</Text>
      <Text>{expoPushToken ?? '토큰 가져오는 중...'}</Text>
      <Text>알림 권한 상태: {permissionStatus ?? '확인 중...'}</Text>

      <Button title="푸시 알림 권한 요청" onPress={requestNotificationPermissions} />
      <Button
        title="Push Token 가져오기"
        onPress={() => getExpoPushToken().then(setExpoPushToken)}
      />
      <Button title="테스트 알림 보내기" onPress={() => sendTestNotification(expoPushToken)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
});

async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    Alert.alert('에뮬레이터에서는 Push 알림을 사용할 수 없습니다.');
    return 'denied';
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('푸시 알림 권한이 거부되었습니다. 설정에서 알림을 활성화하세요.');
    return 'denied';
  }

  console.log('✅ 푸시 알림 권한이 허용됨!');
  return 'granted';
}

// ✅ Expo Push Token 가져오는 함수
async function getExpoPushToken() {
  const permissionStatus = await requestNotificationPermissions();
  if (permissionStatus !== 'granted') {
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);
  return token;
}

// ✅ 푸시 알림 테스트 발송 함수
async function sendTestNotification(token: string | null) {
  if (!token) {
    Alert.alert('Expo Push Token이 없습니다.');
    return;
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      sound: 'default',
      title: '테스트 알림',
      body: '이것은 테스트 푸시 알림입니다.',
    }),
  });

  Alert.alert('푸시 알림을 보냈습니다.');
}

// ✅ 성공 토스트 메시지
const showSuccessToast = () => {
  Toast.show({
    type: 'success',
    props: {
      text1: '기간이 만료되었어요.',
      icon: <CheckIcon color="#4CAF50" />,
    },
    position: 'top',
  });
};

// ✅ 오류 토스트 메시지
const showErrorToast = () => {
  Toast.show({
    type: 'error',
    props: {
      text1: '기간이 만료되었어요.',
      icon: <WarnIcon color="#FF4E4E" />,
      type: 'error',
    },
    position: 'top',
  });
};

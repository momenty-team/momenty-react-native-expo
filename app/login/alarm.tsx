import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import CheckIcon from '@/assets/svg/CheckIcon';

export default function Alarm() {
  const router = useRouter();

  const nextStep = () => {
    router.push('/');
  };

  const requestNotificationPermissions = async () => {
    if (!Device.isDevice) {
      Alert.alert('에뮬레이터에서는 Push 알림을 사용할 수 없습니다.');
      return 'denied';
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('푸시 알림 권한이 거부되었습니다. 설정에서 알림을 활성화하세요.');
        return 'denied';
      }
    }

    console.log('✅ 푸시 알림 권한이 허용됨!');
    return 'granted';
  };

  const handleNotificationPermission = async () => {
    try {
      const permissionStatus = await requestNotificationPermissions();

      if (permissionStatus === 'granted') {
        const { data: expoToken } = await Notifications.getExpoPushTokenAsync();

        console.log('Expo Push Token:', expoToken);

        const response = await fetch('https://api.momenty.co.kr/notification/token', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: expoToken }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        router.push('/');
        Toast.show({
          type: 'success',
          props: {
            text1: '가입 성공!',
            icon: <CheckIcon color="#4CAF50" />,
          },
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error handle notification:', error);
    }
  };

  useEffect(() => {
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
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>모먼티가 제공하는</Text>
          <Text style={styles.title}>기록 알림을 받아볼까요?</Text>
        </View>
        <Text style={styles.subTitle}>모먼티가 기록을 쉽게 할 수 있게 도와줘요.</Text>
        <Text style={styles.subTitle}>기록과 분석이 끝난 정보를 빠르게 확인해봐요.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable onPress={nextStep}>
          <Text style={styles.label}>나중에 할게요.</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleNotificationPermission}>
          <Text style={styles.buttonText}>알림 허용</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 116,
    paddingBottom: 42,
    paddingHorizontal: 24,
  },
  titleContainer: {
    display: 'flex',
  },
  titleWrapper: {
    display: 'flex',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'SUIT-Variable',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  subTitle: {
    fontFamily: 'SUIT Variable',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#5A6B7F',
  },
  buttonWrapper: {
    display: 'flex',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#021730',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    fontFamily: 'SUIT Variable',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 28,
    color: '#F4F6F9',
  },
  label: {
    display: 'flex',
    textAlign: 'center',
    color: '#5A6B7F',
    fontFamily: 'SUIT Variable',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
  },
});

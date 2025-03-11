import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import WarnIcon from '@/assets/svg/WarnIcon';
import CheckIcon from '@/assets/svg/CheckIcon';

export default function Search() {
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

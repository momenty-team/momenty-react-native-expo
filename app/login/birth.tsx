import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';

export default function Birth() {
  const [birthDay, setBirthDay] = useState('');
  const router = useRouter();

  const inputHandler = () => {
    if (!birthDay) {
      Alert.alert('생년월일을 입력해주세요.');
      return;
    }
    router.push('/login/gender');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>김혜준님의 생일을</Text>
          <Text style={styles.title}>알려주세요.</Text>
        </View>
        <Text style={styles.inputLabel}>생년월일</Text>
        <TextInput
          style={styles.input}
          placeholder="8자리로 입력해주세요."
          value={birthDay}
          onChangeText={setBirthDay}
          keyboardType="number-pad"
          returnKeyType="done"
          autoFocus
        />
      </View>
      <Pressable style={styles.button} onPress={inputHandler}>
        <Text style={styles.buttonText}>확인</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 119,
    paddingBottom: 42,
    paddingHorizontal: 24,
  },
  titleContainer: {
    display: 'flex',
  },
  titleWrapper: {
    display: 'flex',
    marginBottom: 28,
  },
  title: {
    fontFamily: 'SUIT-Variable',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  inputLabel: {
    fontFamily: 'SUIT Variable',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#5A6B7F',
  },
  input: {
    borderBottomWidth: 4,
    borderColor: '#5A6B7F',
    paddingVertical: 10,
    width: '100%',
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#021730',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
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
});

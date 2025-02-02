import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';

export default function StepNickName() {
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  const inputHandler = () => {
    if (!nickname) {
      Alert.alert('닉네임을 입력해주세요.');
      return;
    }
    router.push('/auth/signup/StepBirthDay');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>가입을 축하드려요!</Text>
          <Text style={styles.title}>어떻게 불러드리면 될까요?</Text>
        </View>
        <Text style={styles.inputLabel}>닉네임</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          returnKeyType="done"
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

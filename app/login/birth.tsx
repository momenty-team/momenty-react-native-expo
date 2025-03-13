import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { ParamList } from '@/types';

type BirthProps = NativeStackScreenProps<ParamList, 'birth'>;

export default function Birth({ navigation, route }: BirthProps) {
  const [birthDay, setBirthDay] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(true);
  const inputRef = useRef<TextInput>(null); // ref 생성

  const { nickname } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // 1초 후 focus() 호출
      }
    }, 560);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  const inputHandler = () => {
    if (!birthDay) {
      Alert.alert('생년월일을 입력해주세요.');
      return;
    }
    navigation.navigate('gender', { nickname, birth: birthDay });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>김혜준님의 생일을</Text>
          <Text style={styles.title}>알려주세요.</Text>
        </View>
        <Text style={styles.inputLabel}>생년월일</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef} // ref 연결
            style={styles.input}
            placeholder="8자리로 입력해주세요."
            value={birthDay}
            onChangeText={setBirthDay}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            keyboardType="number-pad"
          />
        </View>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable
          style={isInputFocused ? styles.buttonFocus : styles.button}
          onPress={inputHandler}
        >
          <Text style={styles.buttonText}>확인</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 116,
    paddingBottom: 42,
  },
  titleContainer: {
    display: 'flex',
    paddingHorizontal: 24,
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
  inputWrapper: {
    marginTop: 4,
    width: '100%',
    height: 48,
    borderBottomWidth: 4,
    borderColor: '#5A6B7F',
  },
  input: {
    fontFamily: 'SUIT Variable',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 28,
    height: '100%',
    letterSpacing: 0.4,
    width: '100%',
  },
  buttonFocus: {
    backgroundColor: '#021730',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 32,
  },
  button: {
    backgroundColor: '#021730',
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 54,
  },
  buttonText: {
    fontFamily: 'SUIT Variable',
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 28,
    color: '#F4F6F9',
  },
});

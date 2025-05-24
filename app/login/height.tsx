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

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginParamList } from '@/types';

export default function Height({
  navigation,
  route,
}: NativeStackScreenProps<LoginParamList, 'height'>) {
  const [height, setHeight] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(true);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 560);

    return () => clearTimeout(timer);
  }, []);

  const inputHandler = () => {
    if (!height) {
      Alert.alert('키를 입력해주세요.');
      return;
    }

    navigation.navigate('weight', { ...route.params, height });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>피드백에 필요한 데이터를</Text>
          <Text style={styles.title}>수집할게요.</Text>
        </View>
        <Text style={styles.inputLabel}>키 - CM</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="키를 입력해주세요."
            value={height}
            onChangeText={setHeight}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            keyboardType="number-pad"
          />
          <Text style={styles.inputSuffix}>cm</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
    height: 48,
    borderBottomWidth: 4,
    borderColor: '#5A6B7F',
  },
  input: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'SUIT Variable',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 28,
    height: '100%',
    letterSpacing: 0.4,
  },
  inputSuffix: {
    paddingRight: 6,
    fontFamily: 'SUIT Variable',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 28,
    color: '#021730',
    marginLeft: 8,
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

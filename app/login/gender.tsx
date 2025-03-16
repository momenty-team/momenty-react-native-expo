import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/types';

type GenderProps = NativeStackScreenProps<ParamList, 'gender'>;

export default function Gender({ navigation, route }: GenderProps) {
  const router = useRouter();
  const [gender, setGender] = useState<'남성' | '여성' | null>(null);
  const { nickname, birth } = route.params;

  const nextStep = (gender: 'male' | 'female') => (_: GestureResponderEvent) => {
    router.push('/login/explain');
    //setGender(gender);
    //navigation.navigate('explain', { nickname, birth, gender });
    fetch('https://api.momenty.co.kr/users/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: nickname,
        birth_date: '2000-06-28',
        gender: gender,
      }),
    })
      .then((response) => {
        console.log(response);
        router.push('/login/explain');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>성별은</Text>
        <Text style={styles.title}>어떻게 되시나요?</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#D6DAE0' : '#E8EBEF' },
          ]}
          onPress={nextStep('female')}
        >
          <Text style={styles.buttonText}>여성</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#D6DAE0' : '#E8EBEF' },
          ]}
          onPress={nextStep('male')}
        >
          <Text style={styles.buttonText}>남성</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 116,
    paddingBottom: 18,
    paddingHorizontal: 24,
  },
  titleContainer: {
    display: 'flex',
    marginBottom: 52,
  },
  title: {
    fontFamily: 'SUIT-Variable',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  buttonWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    gap: 28,
  },
  button: {
    width: '46%',
    paddingVertical: 80,
    paddingHorizontal: 60,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  buttonText: {
    fontFamily: 'SUIT Variable',
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 32,
    color: '#3A4C61',
  },
});

import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '@/types';

type ExplainProps = NativeStackScreenProps<ParamList, 'explain'>;

export default function Explain({ route }: ExplainProps) {
  const router = useRouter();

  const { nickname, birth, gender } = route.params;

  const nextStep = () => {
    router.push('/login/alarm');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>앱설명설명</Text>
          <Text style={styles.title}>설명설명설명설명</Text>
          <Text style={styles.title}>{nickname}</Text>
          <Text style={styles.title}>{birth}</Text>
          <Text style={styles.title}>{gender}</Text>
        </View>
        <Text style={styles.subTitle}>어쩌구저쩌구어쩌구저쩌구</Text>
        <Text style={styles.subTitle}>궁시렁궁시렁</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Text style={styles.label}>모먼티가요 을매나 좋게요</Text>
        <Pressable style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>앱 설명</Text>
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
    paddingBottom: 54,
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

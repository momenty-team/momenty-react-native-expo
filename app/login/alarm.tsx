import { Link, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Alarm() {
  const router = useRouter();

  const nextStep = () => {
    router.push('/');
  };

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
        <Text style={styles.label}>나중에 할게요.</Text>
        <Pressable style={styles.button} onPress={nextStep}>
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

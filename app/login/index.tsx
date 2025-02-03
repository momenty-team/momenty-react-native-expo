import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Login() {
  const router = useRouter();

  const nextStep = () => {
    router.push('/login/permission');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>일상 속 순간들,</Text>
          <Text style={styles.title}>모먼티로 기록하세요.</Text>
        </View>
        <Text style={styles.subTitle}>나만의 라이프 스타일로 기록하고,</Text>
        <Text style={styles.subTitle}>모먼티가 분석한 정보를 간편하게 확인하세요.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Apple로 로그인</Text>
        </Pressable>
        <Text style={styles.label}>로그인 시, 해당 약관에 동의한 것으로 간주합니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 107,
    paddingBottom: 18,
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
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#021730',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
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
    color: '#99A5B4',
    fontFamily: 'SUIT Variable',
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 16,
  },
});

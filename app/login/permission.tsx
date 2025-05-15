import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BrokenHealthKit, { HealthKitPermissions } from 'react-native-health';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginParamList } from '@/types';

const NativeModules = require('react-native').NativeModules;
const AppleHealthKit = NativeModules.AppleHealthKit as typeof BrokenHealthKit;
AppleHealthKit.Constants = BrokenHealthKit.Constants;

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.BiologicalSex,
      AppleHealthKit.Constants.Permissions.BloodGlucose,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.BodyTemperature,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.EnvironmentalAudioExposure,
      AppleHealthKit.Constants.Permissions.ActivitySummary,
      AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.HeartbeatSeries,
      AppleHealthKit.Constants.Permissions.HeadphoneAudioExposure,
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
    write: [],
  },
};

export default function Permission({
  navigation,
  route,
}: NativeStackScreenProps<LoginParamList, 'permission'>) {
  const nextStep = () => {
    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!', error);
        return;
      }

      navigation.navigate('nickname', route.params);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>건강 데이터 접근을</Text>
          <Text style={styles.title}>허용해 주세요.</Text>
        </View>
        <Text style={styles.subTitle}>모먼티가 기록들을 분석하기 위해서</Text>
        <Text style={styles.subTitle}>건강 데이터 접근 권한이 필요해요.</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Text style={styles.label}>개인정보는 저장하거나 공유하지 않아요.</Text>
        <Text style={styles.label}>모먼티가 정확하게 분석 할 수 있도록 모두 허용해주세요.</Text>
        <Pressable style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>계속하기</Text>
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

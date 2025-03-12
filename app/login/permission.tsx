import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import BrokenHealthKit, { HealthKitPermissions } from 'react-native-health';

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
    ],
    write: [],
  },
};

export default function Permission() {
  const router = useRouter();

  const nextStep = () => {
    // router.push('/login/nickname');

    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!', error);
        return;
      }
    });
  };

  const get = () => {
    // AppleHealthKit.getHeartRateSamples(
    //   {
    //     startDate: new Date(2025, 2, 1).toISOString(),
    //   },
    //   (error, results) => {
    //     if (error) {
    //       console.log('[ERROR] Cannot get sleep samples!', error);
    //       return;
    //     }

    //     console.log('[SUCCESS] Sleep samples fetched!', results);
    //   }
    // );

    // AppleHealthKit.getDailyDistanceWalkingRunningSamples(
    //   {
    //     startDate: new Date(2024, 2, 1).toISOString(),
    //     period: 2,
    //   },
    //   (error, results) => {
    //     if (error) {
    //       console.log('[ERROR] Cannot get sleep samples!', error);
    //       return;
    //     }

    //     console.log('[SUCCESS] Sleep samples fetched!', results);
    //   }
    // );

    AppleHealthKit.getActiveEnergyBurned(
      {
        startDate: new Date(2025, 2, 1).toISOString(),
      },
      (error, results) => {
        if (error) {
          console.log('[ERROR] Cannot get sleep samples!', error);
          return;
        }

        console.log('[SUCCESS] Sleep samples fetched!', results);
      }
    );

    // AppleHealthKit.getBiologicalSex({}, (error, results) => {
    //   if (error) {
    //     console.log('[ERROR] Cannot get sleep samples!', error);
    //     return;
    //   }

    //   console.log('[SUCCESS] Sleep samples fetched!', results);
    // });

    // AppleHealthKit.getBloodGlucoseSamples(
    //   {
    //     startDate: new Date(2025, 2, 1).toISOString(),
    //   },
    //   (error, results) => {
    //     if (error) {
    //       console.log('[ERROR] Cannot get sleep samples!', error);
    //       return;
    //     }

    //     console.log('[SUCCESS] Sleep samples fetched!', results);
    //   }
    // );
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
        <Pressable style={styles.button} onPress={get}>
          <Text style={styles.buttonText}>정보 출력</Text>
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

import type { ActiveEnergyBurned, DistanceWalkingRunning, EnvironmentalAudioExposure, HeadphoneAudioExposure, HeartRateSamples, HeartRateVariabilitySamples, RestingHeartRateSamples, SleepSamples, StepCount } from '@/stores/useKitData';
import BrokenHealthKit from 'react-native-health';
import type { HealthInputOptions } from "react-native-health";

const NativeModules = require('react-native').NativeModules;
const {
  getActiveEnergyBurned,
  getDistanceWalkingRunning,
  getStepCount,
  getHeartRateSamples,
  getHeartRateVariabilitySamples,
  getRestingHeartRateSamples,
  getSleepSamples,
  getEnvironmentalAudioExposure,
  getHeadphoneAudioExposure,
} = NativeModules.AppleHealthKit as typeof BrokenHealthKit;

const fetchHealthData = <T>(
  options: HealthInputOptions,
  fetcher: (opts: HealthInputOptions, callback: (error: string | null, results: any) => void) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetcher(options, (error, results) => {
        if (error) {
          console.error('[ERROR] HealthKit fetch failed:', error);
          reject(error);
          return;
        }

        resolve(results);
      }
    );
  });
};

export const getAllHealthData = async (options: HealthInputOptions) => ({
  activeEnergyBurned : await fetchHealthData<ActiveEnergyBurned[]>(options, getActiveEnergyBurned),
  distanceWalkingRunning : await fetchHealthData<DistanceWalkingRunning>(options, getDistanceWalkingRunning),
  stepCount : await fetchHealthData<StepCount>(options, getStepCount),
  heartRateSamples: await fetchHealthData<HeartRateSamples[]>(options, getHeartRateSamples),
  heartRateVariabilitySamples: await fetchHealthData<HeartRateVariabilitySamples[]>(options, getHeartRateVariabilitySamples),
  restingHeartRateSamples: await fetchHealthData<RestingHeartRateSamples[]>(options, getRestingHeartRateSamples),
  sleepSamples: await fetchHealthData<SleepSamples[]>(options, getSleepSamples),
  environmentalAudioExposure: await fetchHealthData<EnvironmentalAudioExposure[]>(options, getEnvironmentalAudioExposure),
  headphoneAudioExposure: await fetchHealthData<HeadphoneAudioExposure[]>(options, getHeadphoneAudioExposure),
});

export const average = (
  entries: { value: number }[] | undefined,
  digits: number = 1
): number | null => {
  if (!entries || entries.length === 0) return null;
  const total = entries.reduce((sum, e) => sum + (e.value ?? 0), 0);
  return parseFloat((total / entries.length).toFixed(digits));
};

import BrokenHealthKit from 'react-native-health';
import fetchHealthKitData from "./fetchHealthKitData";
import type { HealthInputOptions } from 'react-native-health';
import type { CustomHealthSleepValue, CustomHealthValue } from "@/types";

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

const getHealthKitDailySummary = async (options: HealthInputOptions) => ({
  activeEnergyBurned: await fetchHealthKitData<CustomHealthValue[]>(options, getActiveEnergyBurned),
  distanceWalkingRunning: await fetchHealthKitData<CustomHealthValue>(
    options,
    getDistanceWalkingRunning
  ),
  stepCount: await fetchHealthKitData<CustomHealthValue>(options, getStepCount),
  heartRateSamples: await fetchHealthKitData<CustomHealthValue[]>(options, getHeartRateSamples),
  heartRateVariabilitySamples: await fetchHealthKitData<CustomHealthValue[]>(
    options,
    getHeartRateVariabilitySamples
  ),
  restingHeartRateSamples: await fetchHealthKitData<CustomHealthValue[]>(
    options,
    getRestingHeartRateSamples
  ),
  sleepSamples: calculateTotalSleepTime((await fetchHealthKitData<CustomHealthSleepValue[]>(options, getSleepSamples))),
  environmentalAudioExposure: await fetchHealthKitData<CustomHealthValue[]>(
    options,
    getEnvironmentalAudioExposure
  ),
  headphoneAudioExposure: await fetchHealthKitData<CustomHealthValue[]>(
    options,
    getHeadphoneAudioExposure
  ),
});

const calculateTotalSleepTime = (sleepSamples: CustomHealthSleepValue[]) => {
  const sleepOnly = sleepSamples
    .filter(sample => sample.value !== "AWAKE")
    .map(sample => ({
      start: new Date(sample.startDate).getTime(),
      end: new Date(sample.endDate).getTime(),
    }));

  const sorted = sleepOnly.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const interval of sorted) {
    if (merged.length === 0 || merged[merged.length - 1].end < interval.start) {
      merged.push({ ...interval });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, interval.end);
    }
  }

  // 3. 병합된 구간들의 총 수면 시간 계산
  const totalMillis = merged.reduce((sum, interval) => sum + (interval.end - interval.start), 0);

  const totalMinutes = Math.floor(totalMillis / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}시간 ${String(minutes).padStart(2, '0')}분`;
};

export default getHealthKitDailySummary;
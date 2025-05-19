import BrokenHealthKit from 'react-native-health';
import type { CustomHealthValue } from '@/types';
import type { HealthInputOptions } from 'react-native-health';
import { getDailyAverage } from './processHeartRate';

const NativeModules = require('react-native').NativeModules;
const {
  getActiveEnergyBurned,
  getDistanceWalkingRunning,
  getDailyStepCountSamples,
  getDailyDistanceWalkingRunningSamples,
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
  fetcher: (
    opts: HealthInputOptions,
    callback: (error: string | null, results: any) => void
  ) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetcher(options, (error, results) => {
      if (error) {
        console.error('[ERROR] HealthKit fetch failed:', error);
        reject(error);
        return;
      }

      resolve(results);
    });
  });
};

export const getAllHealthData = async (options: HealthInputOptions) => ({
  activeEnergyBurned: await fetchHealthData<CustomHealthValue[]>(options, getActiveEnergyBurned),
  distanceWalkingRunning: await fetchHealthData<CustomHealthValue>(
    options,
    getDistanceWalkingRunning
  ),
  stepCount: await fetchHealthData<CustomHealthValue>(options, getStepCount),
  heartRateSamples: await fetchHealthData<CustomHealthValue[]>(options, getHeartRateSamples),
  heartRateVariabilitySamples: await fetchHealthData<CustomHealthValue[]>(
    options,
    getHeartRateVariabilitySamples
  ),
  restingHeartRateSamples: await fetchHealthData<CustomHealthValue[]>(
    options,
    getRestingHeartRateSamples
  ),
  sleepSamples: await fetchHealthData<CustomHealthValue[]>(options, getSleepSamples),
  environmentalAudioExposure: await fetchHealthData<CustomHealthValue[]>(
    options,
    getEnvironmentalAudioExposure
  ),
  headphoneAudioExposure: await fetchHealthData<CustomHealthValue[]>(
    options,
    getHeadphoneAudioExposure
  ),
});

type InputItem = {
  startDate: string;
  endDate: string;
  data: CustomHealthValue[];
};

function fillMissingDates(input: InputItem): CustomHealthValue[] {
  const { startDate, endDate, data } = input;

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const dateMap = new Map<string, CustomHealthValue>();

  // 📌 data의 날짜 범위를 하루씩 잘라서 맵에 저장
  for (const item of data) {
    const cur = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);

    while (cur < itemEnd) {
      const dayKey = cur.toISOString().slice(0, 10);
      if (!dateMap.has(dayKey)) {
        const next = new Date(cur);
        next.setDate(next.getDate() + 1);
        dateMap.set(dayKey, {
          startDate: cur.toISOString(),
          endDate: next.toISOString(),
          value: item.value,
          min: item.min,
          max: item.max,
        });
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  // 📌 전체 범위 돌면서 누락된 날짜는 value: 0으로
  const result: CustomHealthValue[] = [];
  const current = new Date(start);

  while (current <= end) {
    const key = current.toISOString().slice(0, 10);
    if (dateMap.has(key)) {
      result.push(dateMap.get(key)!);
    } else {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      result.push({
        startDate: current.toISOString(),
        endDate: next.toISOString(),
        value: 0,
        min: 0,
        max: 0,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export const getActivityHealthData = async (options: HealthInputOptions) => ({
  activeEnergyBurned: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (await fetchHealthData<CustomHealthValue[]>(options, getActiveEnergyBurned)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
  }),
  distanceWalkingRunning: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (
      await fetchHealthData<CustomHealthValue[]>(options, getDailyDistanceWalkingRunningSamples)
    ).map(({ startDate, endDate, value }) => ({ startDate, endDate, value })),
  }),
  stepCount: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (await fetchHealthData<CustomHealthValue[]>(options, getDailyStepCountSamples)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
  }),
});

export const getHeartRateHealthData = async (options: HealthInputOptions) => ({
  heartRateSamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthData<CustomHealthValue[]>(options, getHeartRateSamples)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      1
    ),
  }),
  heartRateVariabilitySamples: getDailyAverage(
    (await fetchHealthData<CustomHealthValue[]>(options, getHeartRateVariabilitySamples)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
    3
  ),

  restingHeartRateSamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthData<CustomHealthValue[]>(options, getRestingHeartRateSamples)).map(
        ({ startDate, endDate, value }) => ({
          startDate,
          endDate,
          value,
        })
      ),
      1
    ),
  }),
});

export const getAudioExposureHealthData = async (options: HealthInputOptions) => ({
  environmentalAudioExposure: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthData<CustomHealthValue[]>(options, getEnvironmentalAudioExposure)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      1
    ),
  }),
  headphoneAudioExposure: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthData<CustomHealthValue[]>(options, getHeadphoneAudioExposure)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      1
    ),
  }),
});

export const getSleepHealthData = async (options: HealthInputOptions) => ({
  sleepSamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (await fetchHealthData<CustomHealthValue[]>(options, getSleepSamples)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
  }),
});

export const average = (
  entries: { value: number }[] | undefined,
  digits: number = 1
): number | null => {
  if (!entries || entries.length === 0) return null;
  const total = entries.reduce((sum, e) => sum + (e.value ?? 0), 0);
  return parseFloat((total / entries.length).toFixed(digits));
};

import BrokenHealthKit from 'react-native-health';
import fetchHealthKitData from "./fetchHealthKitData";
import type { HealthInputOptions } from "react-native-health";
import type { CustomHealthValue } from "@/types";
import getDailyAverage from './getDailyAverage';
import fillMissingDates from './fillMissingDates';

const NativeModules = require('react-native').NativeModules;
const {
  getActiveEnergyBurned,
  getDailyStepCountSamples,
  getDailyDistanceWalkingRunningSamples,
  getHeartRateSamples,
  getHeartRateVariabilitySamples,
  getRestingHeartRateSamples,
  getSleepSamples,
  getEnvironmentalAudioExposure,
  getHeadphoneAudioExposure,
} = NativeModules.AppleHealthKit as typeof BrokenHealthKit;

export const getActivityHealthData = async (options: HealthInputOptions) => ({
  activeEnergyBurned: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (await fetchHealthKitData<CustomHealthValue[]>(options, getActiveEnergyBurned)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
  }),
  distanceWalkingRunning: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (
      await fetchHealthKitData<CustomHealthValue[]>(options, getDailyDistanceWalkingRunningSamples)
    ).map(({ startDate, endDate, value }) => ({ startDate, endDate, value })),
  }),
  stepCount: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (await fetchHealthKitData<CustomHealthValue[]>(options, getDailyStepCountSamples)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
  }),
});

export const getHeartRateHealthData = async (options: HealthInputOptions) => ({
  heartRateSamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthKitData<CustomHealthValue[]>(options, getHeartRateSamples)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      1
    ),
  }),
  heartRateVariabilitySamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthKitData<CustomHealthValue[]>(options, getHeartRateVariabilitySamples)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      3
    ),
  }),
  restingHeartRateSamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthKitData<CustomHealthValue[]>(options, getRestingHeartRateSamples)).map(
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
      (await fetchHealthKitData<CustomHealthValue[]>(options, getEnvironmentalAudioExposure)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      1
    ),
  }),
  headphoneAudioExposure: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: getDailyAverage(
      (await fetchHealthKitData<CustomHealthValue[]>(options, getHeadphoneAudioExposure)).map(
        ({ startDate, endDate, value }) => ({ startDate, endDate, value })
      ),
      1
    ),
  }),
});

export const getSleepHealthData = async (options: HealthInputOptions) => ({
  sleepSamples: (await fetchHealthKitData<CustomHealthValue[]>(options, getSleepSamples)).map(
    ({ startDate, endDate, value }) => ({ startDate, endDate, value })
  ),
});
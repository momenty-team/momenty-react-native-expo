import BrokenHealthKit from 'react-native-health';
import fetchHealthKitData from "./fetchHealthKitData";
import processEnvironmentalAudioExposure from './processEnvironmentalAudioExposure';
import processHeadphoneAudioExposure from './processHeadphoneAudioExposure';
import processDistanceWalkingRunning from './processDistanceWalkingRunning';
import processActiveEnergyBurned from "./processActiveEnergyBurned";
import processStepCountSamples from './processStepCountSamples';
import processHeartRate from './processHeartRate';
import fillMissingDates from './fillMissingDates';
import getDailyAverage from './getDailyAverage';

import type { HealthInputOptions } from "react-native-health";
import type { CustomHealthValue } from "@/types";

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


const generateAiPromptHealthKitData = async (options: HealthInputOptions) => ({
  activeEnergyBurned: processActiveEnergyBurned(
    (
      await fetchHealthKitData<CustomHealthValue[]>({ ...options, period: 15 }, getActiveEnergyBurned)
    ).map(({ startDate, endDate, value }) => ({ startDate, endDate, value }))
  ),
  distanceWalkingRunning: processDistanceWalkingRunning(
    (
      await fetchHealthKitData<CustomHealthValue[]>(
        { ...options, period: 15 },
        getDailyDistanceWalkingRunningSamples
      )
    ).map(({ startDate, endDate, value }) => ({ startDate, endDate, value }))
  ),
  stepCount: processStepCountSamples(
    (
      await fetchHealthKitData<CustomHealthValue[]>(
        { ...options, period: 15 },
        getDailyStepCountSamples
      )
    ).map(({ startDate, endDate, value }) => ({ startDate, endDate, value }))
  ),
  heartRateSamples: processHeartRate(
    (
      await fetchHealthKitData<CustomHealthValue[]>({ ...options, period: 10 }, getHeartRateSamples)
    ).map(({ startDate, endDate, value }) => ({ startDate, endDate, value }))
  ),
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
  environmentalAudioExposure: processEnvironmentalAudioExposure(
    (await fetchHealthKitData<[]>({ ...options, period: 10 }, getEnvironmentalAudioExposure)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    )
  ),
  headphoneAudioExposure: processHeadphoneAudioExposure(
    (await fetchHealthKitData<[]>({ ...options, period: 10 }, getHeadphoneAudioExposure)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    )
  ),
  sleepSamples: fillMissingDates({
    startDate: options.startDate!,
    endDate: options.endDate!,
    data: (await fetchHealthKitData<CustomHealthValue[]>(options, getSleepSamples)).map(
      ({ startDate, endDate, value }) => ({ startDate, endDate, value })
    ),
  }),
});

export default generateAiPromptHealthKitData;
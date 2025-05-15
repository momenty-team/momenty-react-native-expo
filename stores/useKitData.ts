import { HealthValue } from 'react-native-health';
import { create } from 'zustand';

export interface ActiveEnergyBurned {
  startDate: string;
  endDate: string;
  value: number;
  metadata: {
    quality: string;
    sourceName: string;
    sourceId: string;
  }
}

export interface DistanceWalkingRunning {
  startDate: string;
  endDate: string;
  value: number;
}

export interface StepCount { 
  startDate: string;
  endDate: string;
  value: number;
}

export interface HeartRateSamples { 
  startDate: string;
  endDate: string;
  id: string;
  sourceId: string;
  value: number;
  sourceName: string;
  metadata: {
    HKMetadataKeyHeartRateMotionContext: number
  }
}

export interface HeartRateVariabilitySamples {
  startDate: string;
  endDate: string;
  id: string;
  sourceId: string;
  value: number;
  sourceName: string;
  metadata: {
    HKAlgorithmVersion: number;
  }
}

export interface RestingHeartRateSamples {
  startDate: string;
  endDate: string;
  value: number;
  id: string;
  sourceName: string;
  sourceId: string;
}

export type SleepSamples = HealthValue[];

export interface EnvironmentalAudioExposure {
  startDate: string;
  endDate: string;
  value: number;
  id: string;
  sourceName: string;
  sourceId: string;
}

export interface HeadphoneAudioExposure {
  startDate: string;
  endDate: string;
  value: number;
  id: string;
  sourceName: string;
  sourceId: string;
}

export interface HealthKitData {
  activeEnergyBurned: ActiveEnergyBurned[];
  distanceWalkingRunning: DistanceWalkingRunning;
  stepCount: StepCount;
  heartRateSamples: HeartRateSamples[];
  heartRateVariabilitySamples: HeartRateVariabilitySamples[];
  restingHeartRateSamples: RestingHeartRateSamples[];
  sleepSamples: any;
  environmentalAudioExposure: EnvironmentalAudioExposure[];
  headphoneAudioExposure: HeadphoneAudioExposure[];
}

interface HealthKitState {
  healthKitData: Partial<HealthKitData>;
  setHealthKitData: (data: Partial<HealthKitData>) => void;
  clearHealthKitData: () => void;
}

export const useHealthKitStore = create<HealthKitState>((set) => ({
  healthKitData: {},
  setHealthKitData: (data) =>
    set((state) => ({
      healthKitData: {
        ...state.healthKitData,
        ...data,
      },
    })),
  clearHealthKitData: () => set({ healthKitData: {} }),
}));

import type { CustomHealthValue } from '@/types';
import { create } from 'zustand';

export interface HealthKitData {
  activeEnergyBurned: CustomHealthValue[];
  distanceWalkingRunning: CustomHealthValue;
  stepCount: CustomHealthValue;
  heartRateSamples: CustomHealthValue[];
  heartRateVariabilitySamples: CustomHealthValue[];
  restingHeartRateSamples: CustomHealthValue[];
  sleepSamples: CustomHealthValue[];
  environmentalAudioExposure: CustomHealthValue[];
  headphoneAudioExposure: CustomHealthValue[];
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

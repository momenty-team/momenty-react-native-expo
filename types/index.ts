import { Href } from 'expo-router';

export type BridgeRoute = Href | 'goBack';

export type HapticType =
  | 'selection'
  | 'noticeSuccess'
  | 'noticeWarning'
  | 'noticeError'
  | 'ImpactLight'
  | 'ImpactMedium'
  | 'ImpactHeavy'
  | 'ImpactRigid'
  | 'ImpactSoft';
export interface BridgeData {
  route?: BridgeRoute;
  bottomSheet?: {
    name: string;
    state: 'open' | 'close' | 'hold';
    webviewRoute?: string;
    snapIndex?: number;
  };
  haptic?: HapticType;
  history?: {
    route?: string;
    funnel?: string;
  };
  viewState?: 'focus' | 'focusOut';
  toast?: {
    type: 'success' | 'error' | 'info';
    message: string;
  }
  healthKitData?: {
    activeEnergyBurned: any;
    distanceWalkingRunning: any;
    stepCount: any;
    heartRateSamples: any;
    heartRateVariabilitySamples: any;
    restingHeartRateSamples: any;
    sleepSamples: any;
    environmentalAudioExposure: any;
    headphoneAudioExposure: any;
  }
}

export type LoginParamList = {
  index: undefined;
  permission: { first_name: string; last_name: string };
  nickname: { first_name: string; last_name: string };
  birth: { first_name: string; last_name: string; nickname: string };
  gender: { first_name: string; last_name: string; nickname: string; birth_date: string };
  explain: undefined;
  alarm: undefined;
};

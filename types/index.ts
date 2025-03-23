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

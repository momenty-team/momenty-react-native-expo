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

export type ParamList = {
  index: undefined;
  permission: undefined;
  nickname: undefined;
  birth: { nickname: string };
  gender: { nickname: string; birth: string };
  explain: { nickname: string; birth: string; gender: '남성' | '여성' };
  alarm: undefined;
};

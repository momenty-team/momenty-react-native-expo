import { Href } from 'expo-router';

export type BridgeRoute = Href | 'goBack';

export interface BridgeData {
  route?: BridgeRoute;
  bottomSheet?: {
    name: string;
    state: 'open' | 'close';
    webviewRoute?: string;
  };
}

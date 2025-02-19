import type { BridgeRoute } from '@/types';
import { router } from 'expo-router';

export const navigateFromWebView = (route?: BridgeRoute) => {
  try {
    if (route === 'goBack') {
      router.back();
      return;
    }

    if (route) {
      router.push(route);
      return;
    }

    throw new Error('route가 존재하지 않습니다.');
  } catch (error) {
    console.log('전달받은 route의 구조가 올바르지 않습니다.');
    console.error(error);
  }
};

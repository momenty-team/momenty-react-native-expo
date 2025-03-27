import CookieManager from '@react-native-cookies/cookies';
import { getAccessToken, getRefreshToken } from './tokenStorage';
import { WEBVIEW_BASE_URL } from '@/constants/environment';

export const setAuthToWebview = async () => {
  const refreshToken = await getRefreshToken();
  const accessToken = await getAccessToken();

  if (refreshToken && accessToken) {
    await CookieManager.set(WEBVIEW_BASE_URL, {
      name: 'access_token',
      value: accessToken
    });
    await CookieManager.set(WEBVIEW_BASE_URL, {
      name: 'refresh_token',
      value: refreshToken
    });
    await CookieManager.set('https://api.momenty.co.kr', {
      name: 'access_token',
      value: accessToken,
    });
    await CookieManager.set('https://api.momenty.co.kr', {
      name: 'refresh_token',
      value: refreshToken,
    });
    return;
  }

  return new Error('Token is not found');
};
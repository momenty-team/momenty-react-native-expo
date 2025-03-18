import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { getAccessToken, getRefreshToken } from '@/utils/tokenStorage';
import CookieManager from '@react-native-cookies/cookies';

function Alarm() {
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  useEffect(() => {
    const getCookie = async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken) {
        await CookieManager.set(`${WEBVIEW_BASE_URL}/alarm`, {
          name: 'access_token',
          value: accessToken,
        });
        await CookieManager.set(`${WEBVIEW_BASE_URL}/alarm`, {
          name: 'refresh_token',
          value: refreshToken,
        });
        await CookieManager.set('https://api.momenty.co.kr', {
          name: 'access_token',
          value: accessToken,
        });
        await CookieManager.set('https://api.momenty.co.kr', {
          name: 'refresh_token',
          value: refreshToken,
        });
      }
    };

    getCookie();
  }, []);

  return (
    <WebView
      source={{ uri: `${WEBVIEW_BASE_URL}/alarm` }}
      injectedJavaScript={injectionTemplate()}
      onMessage={handleMessage}
      style={{ flex: 1, paddingTop: insets.top }}
      sharedCookiesEnabled={true}
    />
  );
}

export default Alarm;

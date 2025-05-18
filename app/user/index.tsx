import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { Linking } from 'react-native';

function User() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    const { route, externalLink } = data;

    if (route) {
      navigateFromWebView(route);
    }

    if (externalLink?.url) {
      Linking.openURL(externalLink.url).catch((err) => {
        console.error('외부 링크 열기 실패:', err);
      });
    }
  };

  return (
    <WebView
      source={{ uri: `${WEBVIEW_BASE_URL}/user` }}
      injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
      onMessage={handleMessage}
      style={{ flex: 1 }}
      sharedCookiesEnabled={true}
    />
  );
}

export default User;

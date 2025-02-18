import React from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';



function Alarm() {
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  return (
      <WebView
        source={{ uri: `${WEBVIEW_BASE_URL}/alarm` }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1, paddingTop: insets.top }}
      />
  );
}

export default Alarm;
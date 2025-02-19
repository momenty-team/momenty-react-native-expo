import React from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';

export default function AddLog() {
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };
  

  return (
    <WebView
      source={{ uri: `${WEBVIEW_BASE_URL}/add-log` }}
      injectedJavaScript={injectionTemplate()}
      onMessage={handleMessage}
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}
    />
  );
}

import React from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';

export default function AddLog() {
  const insets = useSafeAreaInsets();

  return (
    <WebView
      source={{ uri: `${WEBVIEW_BASE_URL}/add-log` }}
      injectedJavaScript={injectionTemplate()}
      onMessage={(_) => {}}
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}
    />
  );
}

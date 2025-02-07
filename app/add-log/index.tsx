import React from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WebViewScreen() {
  const insets = useSafeAreaInsets();

  return (
    <WebView
      source={{ uri: 'http://172.19.87.32:3000/' }}
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}
    />
  );
}

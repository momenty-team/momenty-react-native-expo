import React from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WebViewScreen() {
  const insets = useSafeAreaInsets();

  return (
    <WebView
      source={{ uri: 'http://172.30.1.95:3000/add-log' }}
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}
    />
  );
}

import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';

{
  /* <Button title="회원가입" onPress={() => router.push('/login')} />
<Button title="add-log" onPress={() => router.push('/add-log')} />
<Button title="calendar" onPress={() => router.push('/calendar')} /> */
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  return (
    <WebView
      source={{ uri: `${WEBVIEW_BASE_URL}` }}
      injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
      onMessage={handleMessage}
      style={{ flex: 1, backgroundColor: '#F4F6F9' }}
    />
  );
}

import TopNavigation from '@/components/TopNavigation';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';
import { router } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import type { WebViewMessageEvent } from 'react-native-webview';

function WeekAnalysis() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

  const onClickBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <TopNavigation onClickBack={onClickBack} />
      <WebView
        ref={webViewRef}
        source={{
          uri: `${WEBVIEW_BASE_URL}/analysis/week-analysis`,
        }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

export default WeekAnalysis;

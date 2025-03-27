import React from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';
import TopNavigation from '@/components/TopNavigation';
import { router } from 'expo-router';
import { View } from 'react-native';

function Calendar() {
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  const onClickBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#ffffff' }}>
      <TopNavigation onClickBack={onClickBack} />
      <WebView
        ref={webViewRef}
        source={{ uri: `${WEBVIEW_BASE_URL}/calendar` }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
      />
    </View>
  );
}

export default Calendar;

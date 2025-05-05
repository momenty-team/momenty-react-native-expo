import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { View } from 'react-native';

function Analysis() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <WebView
        source={{ uri: `${WEBVIEW_BASE_URL}/analysis` }}
        injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

export default Analysis;

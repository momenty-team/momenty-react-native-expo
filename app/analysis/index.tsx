import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { View } from 'react-native';

function Analysis() {
  const insets = useSafeAreaInsets();

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <WebView
        source={{ uri: `${WEBVIEW_BASE_URL}/analysis` }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

export default Analysis;

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import TopNavigation from '@/components/TopNavigation';
import WebView from 'react-native-webview';
import { View } from 'react-native';
import { router } from 'expo-router';
import { navigateFromWebView } from '@/utils';

import type { WebViewMessageEvent } from 'react-native-webview';

function Privacy() {
  const insets = useSafeAreaInsets();

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
        source={{ uri: `${WEBVIEW_BASE_URL}/user/privacy` }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
      />
    </View>
  );
}

export default Privacy;

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import { router } from 'expo-router';
import { navigateFromWebView } from '@/utils';
import { View } from 'react-native';
import TopNavigation from '@/components/TopNavigation';
import type { WebViewMessageEvent } from 'react-native-webview';

function FeedbackCollection() {
  const insets = useSafeAreaInsets();

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
        source={{ uri: `${WEBVIEW_BASE_URL}/analysis/feedback-collection` }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

export default FeedbackCollection;

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { StyleSheet, View, Animated } from 'react-native';
import { useRef, useState } from 'react';

function Analysis() {
  const insets = useSafeAreaInsets();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  const handleLoadEnd = () => {
    setIsWebViewReady(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          source={{ uri: `${WEBVIEW_BASE_URL}/analysis` }}
          injectedJavaScript={injectionTemplate()}
          onMessage={handleMessage}
          style={{ flex: 1 }}
          sharedCookiesEnabled={true}
        />
      </Animated.View>
    </View>
  );
}

export default Analysis;

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

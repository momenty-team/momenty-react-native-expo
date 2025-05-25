import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { Linking } from 'react-native';
import { View, StyleSheet, Animated } from 'react-native';

function User() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    const { route, externalLink } = data;

    if (route) {
      navigateFromWebView(route);
    }

    if (externalLink?.url) {
      Linking.openURL(externalLink.url).catch((err) => {
        console.error('외부 링크 열기 실패:', err);
      });
    }
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
    <View style={styles.container}>
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          source={{ uri: `${WEBVIEW_BASE_URL}/user` }}
          injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
          onMessage={handleMessage}
          style={{ flex: 1 }}
          sharedCookiesEnabled={true}
        />
      </Animated.View>
    </View>
  );
}

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

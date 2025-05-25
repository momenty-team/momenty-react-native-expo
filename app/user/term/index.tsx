import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import TopNavigation from '@/components/TopNavigation';
import WebView from 'react-native-webview';
import { StyleSheet, View, Animated } from 'react-native';
import { router } from 'expo-router';
import { navigateFromWebView } from '@/utils';
import { useRef, useState } from 'react';

import type { WebViewMessageEvent } from 'react-native-webview';

function Term() {
  const insets = useSafeAreaInsets();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  const onClickBack = () => {
    router.back();
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
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#ffffff' }}>
      <TopNavigation onClickBack={onClickBack} />
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          source={{ uri: `${WEBVIEW_BASE_URL}/user/term` }}
          injectedJavaScript={injectionTemplate()}
          onMessage={handleMessage}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

export default Term;

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

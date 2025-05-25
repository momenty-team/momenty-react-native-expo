import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import { router } from 'expo-router';
import TopNavigation from '@/components/TopNavigation';
import { StyleSheet, View, Animated } from 'react-native';
import { useRef, useState } from 'react';

function Notification() {
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
          source={{ uri: `${WEBVIEW_BASE_URL}/user/notification` }}
          injectedJavaScript={injectionTemplate()}
          onMessage={handleMessage}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

export default Notification;

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

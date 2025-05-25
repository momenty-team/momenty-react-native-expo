import React from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import TopNavigation from '@/components/TopNavigation';
import { StyleSheet, View, Animated } from 'react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

export default function AddLog() {
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [stepStack, setStepStack] = React.useState<string[]>([]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const { history, route } = JSON.parse(event.nativeEvent.data);

    if (history && history?.funnel) {
      if (!stepStack.includes(history.funnel)) setStepStack((prev) => [...prev, history.funnel]);
    }

    if (route === '/') {
      router.back();
    }
  };

  const onClickBack = () => {
    if (stepStack.length <= 1) return router.back();

    webViewRef?.current?.postMessage(
      JSON.stringify({ history: { funnel: stepStack[stepStack.length - 2] } })
    );

    return setStepStack((prev) => prev.slice(0, prev.length - 1));
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
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}>
      <TopNavigation onClickBack={onClickBack} />
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          ref={webViewRef}
          source={{ uri: `${WEBVIEW_BASE_URL}/add-log` }}
          injectedJavaScript={injectionTemplate()}
          onMessage={handleMessage}
          style={{ flex: 1, backgroundColor: '#F4F6F9' }}
          sharedCookiesEnabled={true}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

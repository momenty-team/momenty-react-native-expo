import React from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';

import { StyleSheet, Pressable, View, Text, Animated } from 'react-native';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
import TopNavigation from '@/components/TopNavigation';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

function Alarm() {
  const [isSetting, setIsSetting] = React.useState(false);
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  const onClickBack = () => {
    if (isSetting) {
      return setIsSetting(false);
    }

    return router.back();
  };

  const onClickSetting = () => {
    setIsSetting(true);
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
      <TopNavigation onClickBack={onClickBack}>
        {!isSetting && (
          <Pressable onPress={onClickSetting}>
            <Text style={styles.settingButtonText}>설정</Text>
          </Pressable>
        )}
      </TopNavigation>
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          ref={webViewRef}
          source={{
            uri: isSetting ? `${WEBVIEW_BASE_URL}/user/notification` : `${WEBVIEW_BASE_URL}/alarm`,
          }}
          injectedJavaScript={injectionTemplate()}
          onMessage={handleMessage}
          style={{ flex: 1 }}
          sharedCookiesEnabled={true}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingButtonText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#021730',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default Alarm;

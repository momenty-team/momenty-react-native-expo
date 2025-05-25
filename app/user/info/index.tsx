import React, { useRef, useState } from 'react';
import { StyleSheet, Pressable, View, Text, Animated } from 'react-native';
import WebView from 'react-native-webview';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import TopNavigation from '@/components/TopNavigation';

import type { WebViewMessageEvent } from 'react-native-webview';

function UserInfo() {
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMessage = (event: WebViewMessageEvent) => {
    const { route } = JSON.parse(event.nativeEvent.data);

    if (route) {
      setIsEditMode(false);
    }
  };

  const onClickBack = () => {
    if (isEditMode) {
      return setIsEditMode(false);
    }

    return router.back();
  };

  const onClickEdit = () => {
    setIsEditMode(true);
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
        {!isEditMode && (
          <Pressable onPress={onClickEdit}>
            <Text style={styles.settingButtonText}>수정</Text>
          </Pressable>
        )}
      </TopNavigation>
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          ref={webViewRef}
          source={{
            uri: isEditMode
              ? `${WEBVIEW_BASE_URL}/user/info/edit`
              : `${WEBVIEW_BASE_URL}/user/info`,
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

export default UserInfo;

import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import type { WebViewMessageEvent } from 'react-native-webview';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';
import switchWebViewHaptic from '@/utils/switchWebViewHaptic';
import CheckIcon from '@/assets/svg/CheckIcon';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<WebView>(null);
  const mainWebviewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetRoute, setBottomSheetRoute] = useState<string | null>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    const { bottomSheet, route, haptic, message, toast } = JSON.parse(event.nativeEvent.data);

    if (message) {
      console.log(message);
    }

    if (route) {
      navigateFromWebView(route);
    }

    if (toast) {
      showToast(toast.type, toast.message);
    }

    if (bottomSheet) {
      if (bottomSheet.state === 'open') {
        bottomSheetRef.current?.snapToIndex(bottomSheet.snapIndex);

        setBottomSheetRoute(bottomSheet.webviewRoute);
      }

      if (bottomSheet.state === 'hold') {
        if (!isBottomSheetOpen && bottomSheet.snapIndex === 0) return;

        bottomSheetRef.current?.snapToIndex(bottomSheet.snapIndex);
      }

      if (bottomSheet.state === 'close') {
        setBottomSheetRoute(null);
      }
    }

    if (haptic) {
      switchWebViewHaptic(haptic);
    }
  };

  const handleSheetChange = (index: number) => {
    if (index === -1) {
      return setIsBottomSheetOpen(false);
    }

    webViewRef?.current?.postMessage(
      JSON.stringify({
        bottomSheet: { name: 'log-detail', state: 'hold', snapIndex: index },
      })
    );

    return setIsBottomSheetOpen(true);
  };

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  useFocusEffect(
    React.useCallback(() => {
      mainWebviewRef?.current?.postMessage(JSON.stringify({ viewState: 'focus' }));
      webViewRef?.current?.postMessage(JSON.stringify({ viewState: 'focus' }));

      return () => {
        mainWebviewRef?.current?.postMessage(JSON.stringify({ viewState: 'focusOut' }));
        webViewRef?.current?.postMessage(JSON.stringify({ viewState: 'focusOut' }));
      };
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WebView
        ref={mainWebviewRef}
        source={{ uri: `${WEBVIEW_BASE_URL}` }}
        injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: '#F4F6F9' }}
        sharedCookiesEnabled={true}
      />

      <BottomSheet
        snapPoints={['50%', '90%']}
        ref={bottomSheetRef}
        enablePanDownToClose
        enableContentPanningGesture={false}
        index={-1}
        onChange={handleSheetChange}
        onClose={() => {
          webViewRef?.current?.postMessage(
            JSON.stringify({ bottomSheet: { name: 'log-detail', state: 'close' } })
          );
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {bottomSheetRoute && (
            <WebView
              ref={webViewRef}
              source={{ uri: `${WEBVIEW_BASE_URL}${bottomSheetRoute}` }}
              injectedJavaScript={injectionTemplate()}
              onMessage={handleMessage}
              style={styles.contentContainer}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
});

const showToast = (type: string, message: string) => {
  Toast.show({
    type,
    props: {
      text1: message,
      icon: <CheckIcon color="#4CAF50" />,
    },
    position: 'top',
  });
};

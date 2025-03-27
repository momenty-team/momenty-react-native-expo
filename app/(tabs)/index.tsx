import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import type { WebViewMessageEvent } from 'react-native-webview';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';
import switchWebViewHaptic from '@/utils/switchWebViewHaptic';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const { bottomSheet, route, haptic, message } = JSON.parse(event.nativeEvent.data);

    if (message) {
      console.log(message);
    }

    if (route) {
      navigateFromWebView(route);
    }

    if (bottomSheet) {
      if (bottomSheet.state === 'open') {
        bottomSheetRef.current?.snapToIndex(bottomSheet.snapIndex);
      }

      if (bottomSheet.state === 'hold') {
        if (!isBottomSheetOpen && bottomSheet.snapIndex === 0) return;

        bottomSheetRef.current?.snapToIndex(bottomSheet.snapIndex);
      }
    }

    if (haptic) {
      switchWebViewHaptic(haptic);
    }
  };

  const handleSheetChange = (index: number) => {
    console.log('handleSheetChange', index);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WebView
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
          <WebView
            ref={webViewRef}
            source={{ uri: `${WEBVIEW_BASE_URL}/log-detail` }}
            injectedJavaScript={injectionTemplate()}
            onMessage={handleMessage}
            style={styles.contentContainer}
          />
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

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const { bottomSheet, route } = JSON.parse(event.nativeEvent.data);

    if (route) {
      navigateFromWebView(route);
    }

    if (bottomSheet && bottomSheet.state === 'open') {
      bottomSheetRef.current?.expand();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WebView
        source={{ uri: `${WEBVIEW_BASE_URL}` }}
        injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: '#F4F6F9' }}
      />

      <BottomSheet
        snapPoints={['50%']}
        ref={bottomSheetRef}
        enablePanDownToClose
        enableContentPanningGesture={false}
        index={-1}
      >
        <BottomSheetView style={styles.contentContainer}>
          <WebView
            source={{ uri: `${WEBVIEW_BASE_URL}/log-detail` }}
            injectedJavaScript={injectionTemplate()}
            onMessage={(_) => {}}
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
});

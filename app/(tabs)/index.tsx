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
import { useAuth } from '@/utils/useAuth';

export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mainWebViewRef = useRef<WebView>(null);
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { accessToken, refreshToken } = useAuth();

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const handleMessage = (event: WebViewMessageEvent) => {
    const { bottomSheet, route, haptic, message } = JSON.parse(event.nativeEvent.data);

    console.log(event.nativeEvent.data);
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
        injectedJavaScript={injectionTemplate({
          tokens: { accessToken, refreshToken },
          options: { safeAreaTopInset: notchHeight },
        })}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: '#F4F6F9' }}
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
      {/* <View style={styles.buttonContainer}>
        <Button title="Selection" onPress={() => Haptics.selectionAsync()} />
      </View>
      <Text>Haptics.notificationAsync</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Success"
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        />
        <Button
          title="Error"
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)}
        />
        <Button
          title="Warning"
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}
        />
      </View>
      <Text>Haptics.impactAsync</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Light"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <Button
          title="Medium"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        />
        <Button
          title="Heavy"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        />
        <Button
          title="Rigid"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}
        />
        <Button
          title="Soft"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}
        />
      </View> */}
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

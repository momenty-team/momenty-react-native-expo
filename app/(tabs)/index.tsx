/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useFocusEffect } from 'expo-router';
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
import useSelectedDate from '@/stores/useSelectedDate';

import { useHealthKitStore } from '@/stores/useKitData';
import {
  average,
  getActivityHealthData,
  getAllHealthData,
  getAudioExposureHealthData,
  getHeartRateHealthData,
} from '@/utils/health';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const mainWebviewRef = useRef<WebView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { day, month, year } = useSelectedDate();

  const [notchHeight, setNotchHeight] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetRoute, setBottomSheetRoute] = useState<string | null>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    const { bottomSheet, route, haptic, message, toast } = JSON.parse(event.nativeEvent.data);
    console.log('event.nativeEvent.data', event.nativeEvent.data);
    if (message) {
      console.log(message);
    }

    if (route) navigateFromWebView(route);

    if (toast) showToast(toast.type, toast.message);

    if (bottomSheet) {
      if (bottomSheet.state === 'open') {
        bottomSheetRef.current?.snapToIndex(bottomSheet.snapIndex);

        setBottomSheetRoute(bottomSheet.webviewRoute);
      }

      if (bottomSheet.state === 'hold') {
        if (!isBottomSheetOpen && bottomSheet.snapIndex === 0) return;

        bottomSheetRef.current?.snapToIndex(bottomSheet.snapIndex);
      }

      if (bottomSheet.state === 'close') setBottomSheetRoute(null);
    }

    if (haptic) switchWebViewHaptic(haptic);
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

  const setHealthData = async () => {
    const startDate = new Date(year, month - 1, day);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day);
    endDate.setHours(23, 59, 59, 999);

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      date: new Date(year, month - 1, day).toISOString(),
    };

    try {
      useHealthKitStore.getState().setHealthKitData(await getAllHealthData(options));
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const sendHealthSummaryToWebView = () => {
    const data = useHealthKitStore.getState().healthKitData;

    const summary = {
      activeEnergyBurned: average(data.activeEnergyBurned),
      distanceWalkingRunning: data.distanceWalkingRunning?.value ?? null,
      stepCount: data.stepCount?.value ?? null,
      heartRateSamples: average(data.heartRateSamples),
      heartRateVariabilitySamples: average(data.heartRateVariabilitySamples, 2),
      restingHeartRateSamples: average(data.restingHeartRateSamples),
      sleepSamples: data.sleepSamples,
      environmentalAudioExposure: average(data.environmentalAudioExposure),
      headphoneAudioExposure: average(data.headphoneAudioExposure),
    };

    mainWebviewRef?.current?.postMessage(JSON.stringify({ healthKitData: summary }));
  };

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  useFocusEffect(
    React.useCallback(() => {
      mainWebviewRef?.current?.postMessage(JSON.stringify({ viewState: 'focus' }));
      webViewRef?.current?.postMessage(JSON.stringify({ viewState: 'focus' }));
      setHealthData().then(() => sendHealthSummaryToWebView());

      return () => {
        mainWebviewRef?.current?.postMessage(JSON.stringify({ viewState: 'focusOut' }));
        webViewRef?.current?.postMessage(JSON.stringify({ viewState: 'focusOut' }));
      };
    }, [day, month, year])
  );

  const hasDate = day && month && year;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WebView
        ref={mainWebviewRef}
        source={{
          uri: hasDate
            ? `${WEBVIEW_BASE_URL}?year=${year}&month=${month}&day=${day}`
            : WEBVIEW_BASE_URL,
        }}
        injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
        onMessage={handleMessage}
        style={{ flex: 1, backgroundColor: '#F4F6F9' }}
        onLoadEnd={async () => {
          await setHealthData();
          sendHealthSummaryToWebView();
        }}
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
              source={{
                uri: `${WEBVIEW_BASE_URL}${bottomSheetRoute}?year=${year}&month=${month}&day=${day}`,
              }}
              injectedJavaScript={injectionTemplate()}
              onMessage={handleMessage}
              style={styles.contentContainer}
              onLoadEnd={async () => {
                const endDateObj = new Date(year, month - 1, day);
                const startDateObj = new Date(year, month - 1, day);
                startDateObj.setDate(startDateObj.getDate() - 6); // 7일 전으로 설정

                if (bottomSheetRoute === '/healthkit-detail/activity') {
                  webViewRef?.current?.postMessage(
                    JSON.stringify({
                      healthKitData: await getActivityHealthData({
                        startDate: startDateObj.toISOString(),
                        endDate: endDateObj.toISOString(),
                        period: 60 * 24,
                      }),
                    })
                  );
                }

                if (bottomSheetRoute === '/healthkit-detail/heart-rate') {
                  webViewRef?.current?.postMessage(
                    JSON.stringify({
                      healthKitData: await getHeartRateHealthData({
                        startDate: startDateObj.toISOString(),
                        endDate: endDateObj.toISOString(),
                      }),
                    })
                  );
                }

                if (bottomSheetRoute === '/healthkit-detail/noise') {
                  webViewRef?.current?.postMessage(
                    JSON.stringify({
                      healthKitData: await getAudioExposureHealthData({
                        startDate: startDateObj.toISOString(),
                        endDate: endDateObj.toISOString(),
                        period: 60 * 24,
                      }),
                    })
                  );
                }
              }}
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

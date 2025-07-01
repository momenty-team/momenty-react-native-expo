import React from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';
import TopNavigation from '@/components/TopNavigation';
import { router } from 'expo-router';
import { StyleSheet, View, Animated } from 'react-native';
import useSelectedDate from '@/stores/useSelectedDate';
import { useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

function Calendar() {
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);
  const { day, month, year } = useSelectedDate();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { from } = useLocalSearchParams();

  const handleMessage = (event: WebViewMessageEvent) => {
    const { route, date } = JSON.parse(event.nativeEvent.data);

    if (route) {
      navigateFromWebView(route);
    }

    if (date) {
      const { year, month, day } = date;

      const selectedDate = new Date(year, month - 1, day);

      useSelectedDate.setState({
        day,
        month,
        year,
        selectedDate,
      });
    }
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
          ref={webViewRef}
          source={{
            uri: `${WEBVIEW_BASE_URL}/calendar?year=${year}&month=${month}&day=${day}&from=${
              from || ''
            }`,
          }}
          injectedJavaScript={injectionTemplate()}
          onMessage={handleMessage}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

export default Calendar;

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

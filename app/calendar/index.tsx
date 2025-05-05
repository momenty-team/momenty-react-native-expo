import React from 'react';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { navigateFromWebView } from '@/utils';
import TopNavigation from '@/components/TopNavigation';
import { router } from 'expo-router';
import { View } from 'react-native';
import useSelectedDate from '@/stores/useSelectedDate';

function Calendar() {
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);
  const { day, month, year } = useSelectedDate();

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

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#ffffff' }}>
      <TopNavigation onClickBack={onClickBack} />
      <WebView
        ref={webViewRef}
        source={{ uri: `${WEBVIEW_BASE_URL}/calendar?year=${year}&month=${month}&day=${day}` }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
      />
    </View>
  );
}

export default Calendar;

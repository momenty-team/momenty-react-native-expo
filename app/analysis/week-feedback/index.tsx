import TopNavigation from '@/components/TopNavigation';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import useSelectedDate from '@/stores/useSelectedDate';
import { navigateFromWebView } from '@/utils';
import generateAiPromptHealthKitData from '@/utils/healthkit/generateAiPromptHealthKitData';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Button, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import type { WebViewMessageEvent } from 'react-native-webview';

function WeekFeedback() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const { day, month, year } = useSelectedDate();

  const onClickBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  const feedbackTestExample = async () => {
    const endDateObj = new Date(year, month - 1, day);
    const startDateObj = new Date(year, month - 1, day);
    startDateObj.setDate(startDateObj.getDate() - 6);

    try {
      const result = await generateAiPromptHealthKitData({
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
      });
      console.log('result generated');

      const res = await fetch(
        `https://api.momenty.co.kr/records/feedback?year=${year}&month=${month}&day=${day}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            health_kit: JSON.stringify(result),
          }),
        }
      );

      console.log('Response:', await res.json());
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <TopNavigation onClickBack={onClickBack} />
      <Button title="Test" onPress={feedbackTestExample} />
      <WebView
        ref={webViewRef}
        source={{
          uri: `${WEBVIEW_BASE_URL}/analysis/week-feedback?year=${year}&month=${month}&day=${day}`,
        }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

export default WeekFeedback;

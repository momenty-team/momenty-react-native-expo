import TopNavigation from '@/components/TopNavigation';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import { router, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import CheckIcon from '@/assets/svg/CheckIcon';
import { navigateFromWebView } from '@/utils';
import useSelectedDate from '@/stores/useSelectedDate';
import { useRef, useState } from 'react';

function LogSetting() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { day, month, year } = useSelectedDate();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onClickBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const { route, toast } = JSON.parse(event.nativeEvent.data);

    if (toast) {
      showToast(toast.type, toast.message);
    }

    if (route) {
      navigateFromWebView(route);
    }
  };

  const hasDate = day && month && year;

  const handleLoadEnd = () => {
    setIsWebViewReady(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <TopNavigation onClickBack={onClickBack} />
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {hasDate && (
          <WebView
            onLoadEnd={handleLoadEnd}
            source={{
              uri: `${WEBVIEW_BASE_URL}/log-setting/${id}?year=${year}&month=${month}&day=${day}`,
            }}
            injectedJavaScript={injectionTemplate()}
            style={{ flex: 1, backgroundColor: '#fff' }}
            onMessage={handleMessage}
            sharedCookiesEnabled={true}
          />
        )}
      </Animated.View>
    </View>
  );
}

export default LogSetting;

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

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

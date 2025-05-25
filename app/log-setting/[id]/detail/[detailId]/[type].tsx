import { View, StyleSheet, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import TopNavigation from '@/components/TopNavigation';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';
import CheckIcon from '@/assets/svg/CheckIcon';
import { navigateFromWebView } from '@/utils';
import switchWebViewHaptic from '@/utils/switchWebViewHaptic';
import { useRef, useState } from 'react';

function Detail() {
  const insets = useSafeAreaInsets();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { id, detailId, type } = useLocalSearchParams();
  const onClickBack = () => {
    router.back();
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const { route, toast, haptic } = JSON.parse(event.nativeEvent.data);

    if (haptic) {
      switchWebViewHaptic(haptic);
    }

    if (toast) {
      showToast(toast.type, toast.message);
    }

    if (route) {
      navigateFromWebView(route);
    }
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
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <TopNavigation onClickBack={onClickBack} />
      {!isWebViewReady && <View style={styles.loaderContainer} />}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <WebView
          onLoadEnd={handleLoadEnd}
          source={{ uri: `${WEBVIEW_BASE_URL}/log-setting/${id}/detail/${detailId}/${type}` }}
          injectedJavaScript={injectionTemplate()}
          style={{ flex: 1, backgroundColor: '#fff' }}
          onMessage={handleMessage}
          sharedCookiesEnabled={true}
        />
      </Animated.View>
    </View>
  );
}

export default Detail;

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

import { View } from 'react-native';
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

function Detail() {
  const insets = useSafeAreaInsets();
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

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <TopNavigation onClickBack={onClickBack} />
      <WebView
        source={{ uri: `${WEBVIEW_BASE_URL}/log-setting/${id}/detail/${detailId}/${type}` }}
        injectedJavaScript={injectionTemplate()}
        style={{ flex: 1, backgroundColor: '#fff' }}
        onMessage={handleMessage}
        sharedCookiesEnabled={true}
      />
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

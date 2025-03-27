import React from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { injectionTemplate } from '@/constants/injectionTemplate';

import { StyleSheet, Pressable, View, Text } from 'react-native';

import type { WebViewMessageEvent } from 'react-native-webview';
import { navigateFromWebView } from '@/utils';
// import { setAuthToWebview } from '@/utils/cookie';
import TopNavigation from '@/components/TopNavigation';
import { router } from 'expo-router';

function Alarm() {
  const [isSetting, setIsSetting] = React.useState(false);
  const insets = useSafeAreaInsets();
  const webViewRef = React.useRef<WebView>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    navigateFromWebView(JSON.parse(event.nativeEvent.data).route);
  };

  const onClickBack = () => {
    if (isSetting) {
      return setIsSetting(false);
    }

    return router.back();
  };

  const onClickSetting = () => {
    setIsSetting(true);
  };

  // useEffect(() => {
  //   setAuthToWebview();
  // }, []);

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#ffffff' }}>
      <TopNavigation onClickBack={onClickBack}>
        {!isSetting && (
          <Pressable onPress={onClickSetting}>
            <Text style={styles.settingButtonText}>설정</Text>
          </Pressable>
        )}
      </TopNavigation>
      <WebView
        ref={webViewRef}
        source={{
          uri: isSetting ? `${WEBVIEW_BASE_URL}/alarm/setting` : `${WEBVIEW_BASE_URL}/alarm`,
        }}
        injectedJavaScript={injectionTemplate()}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        sharedCookiesEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  settingButtonText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#021730',
  },
});

export default Alarm;

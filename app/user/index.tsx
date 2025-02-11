import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { WEBVIEW_BASE_URL } from '@/constants/environment';
import WebView from 'react-native-webview';
import { injectionTemplate } from '@/constants/injectionTemplate';

function User() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  return (
    <WebView
      source={{ uri: `${WEBVIEW_BASE_URL}/user` }}
      injectedJavaScript={injectionTemplate({ options: { safeAreaTopInset: notchHeight } })}
      onMessage={(_) => {}}
      style={{ flex: 1 }}
    />
  );
}

export default User;

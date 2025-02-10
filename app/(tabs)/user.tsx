import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

function User() {
  const insets = useSafeAreaInsets();
  const [notchHeight, setNotchHeight] = useState(0);

  useEffect(() => {
    setNotchHeight(insets.top);
  }, [insets]);

  const injectedCSS = `
    const style = document.createElement('style');
    style.innerHTML = \`
      body {
        padding-top: ${notchHeight}px !important;
      }

      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
    \`;
    document.head.appendChild(style);
    true;
`;

  return (
    <WebView
      source={{ uri: `http://172.19.83.8:3000/user` }}
      injectedJavaScript={injectedCSS}
      onMessage={(_) => {}}
      style={{ flex: 1 }}
    />
  );
}

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

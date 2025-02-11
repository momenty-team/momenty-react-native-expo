import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WebViewScreen() {
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
      source={{ uri: 'http://192.168.184.27:3000/add-log' }}
      injectedJavaScript={injectedCSS}
      onMessage={(_) => {}}
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}
    />
  );
}

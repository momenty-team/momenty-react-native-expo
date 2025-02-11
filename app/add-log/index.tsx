import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WEBVIEW_BASE_URL } from '@/constants/environment';

export default function AddLog() {
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
      injectedJavaScript={injectedCSS}
      onMessage={(_) => {}}
      source={{ uri: `${WEBVIEW_BASE_URL}/add-log` }}
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F4F6F9' }}
    />
  );
}

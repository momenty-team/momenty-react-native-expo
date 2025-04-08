import { WEBVIEW_BASE_URL } from '@/constants/environment';
import { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from '@/utils/tokenStorage';
import CookieManager from '@react-native-cookies/cookies';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    const accessToken = await getAccessToken();
    if (!refreshToken || !accessToken) {
      // 완전 로그인 부터
      return;
    }
    
    await CookieManager.set('https://api.momenty.co.kr', { name: 'access_token', value: accessToken });
    await CookieManager.set('https://api.momenty.co.kr', { name: 'refresh_token', value: refreshToken });

    const response = await fetch('https://api.momenty.co.kr/token/access-token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const setCookieHeader = response.headers.get('set-cookie');
      
      if (!setCookieHeader) return;

      const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/);
      const refreshTokenMatch = setCookieHeader.match(/refresh_token=([^;]+)/);

      const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
      const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;
      
      if (accessToken && refreshToken) {
        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);

        await CookieManager.set(WEBVIEW_BASE_URL, { name: 'access_token', value: accessToken });
        await CookieManager.set(WEBVIEW_BASE_URL, { name: 'refresh_token', value: refreshToken });
      } else {
        alert('filtered Token is null');
      }

      // await AsyncStorage.setItem('lastRefreshTime', Date.now().toString());
    } else {
      console.error('❌ [refreshAccessToken] !response.ok:');
      alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
    }
  } catch (error) {
    console.error('❌ [refreshAccessToken] error:', error);
    alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
    // 완전 록드인, 토큰 만료 상태 코드일 때
  }
};

export default refreshAccessToken;
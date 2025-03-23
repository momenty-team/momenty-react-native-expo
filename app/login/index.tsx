import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { saveAccessToken, saveRefreshToken } from '@/utils/tokenStorage';
import CookieManager from '@react-native-cookies/cookies';
import { WEBVIEW_BASE_URL } from '@/constants/environment';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LoginParamList } from '@/types';

export default function Login({ navigation }: NativeStackScreenProps<LoginParamList, 'index'>) {
  const [loading, setLoading] = useState(false);

  const handleAppleLogin = async () => {
    try {
      setLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const response = await fetch(
          `https://api.momenty.co.kr/auth/apple/callback?code=${credential.authorizationCode}&id_token=${credential.identityToken}&state=${credential.state}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );

        const result = await response.json();
        setLoading(false);

        if (response.ok) {
          const setCookieHeader = response.headers.get('set-cookie');

          if (setCookieHeader) {
            const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/);
            const refreshTokenMatch = setCookieHeader.match(/refresh_token=([^;]+)/);

            const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
            const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

            if (accessToken && refreshToken) {
              await saveAccessToken(accessToken);
              await saveRefreshToken(refreshToken);

              await CookieManager.set(WEBVIEW_BASE_URL, {
                name: 'access_token',
                value: accessToken,
              });
              await CookieManager.set(WEBVIEW_BASE_URL, {
                name: 'refresh_token',
                value: refreshToken,
              });
              await CookieManager.set('https://api.momenty.co.kr', {
                name: 'access_token',
                value: accessToken,
              });
              await CookieManager.set('https://api.momenty.co.kr', {
                name: 'refresh_token',
                value: refreshToken,
              });

              if (credential?.fullName) {
                navigation.navigate('permission', {
                  first_name: credential.fullName?.givenName || '',
                  last_name: credential.fullName?.familyName || '',
                });
              } else {
                navigation.navigate('permission', { first_name: '', last_name: '' });
              }
            } else {
              alert('토큰을 정상적으로 받지 못했습니다.');
            }
          }
        } else {
          alert(`로그인 실패: ${result}`);
        }
      }
    } catch (e) {
      console.log(e);
      setLoading(false);

      const error = e as { code?: string };

      if (error.code === 'ERR_REQUEST_CANCELED') {
        alert('로그인이 취소되었습니다. 다시 시도해주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>일상 속 순간들,</Text>
          <Text style={styles.title}>모먼티로 기록하세요.</Text>
        </View>
        <Text style={styles.subTitle}>나만의 라이프 스타일로 기록하고,</Text>
        <Text style={styles.subTitle}>모먼티가 분석한 정보를 간편하게 확인하세요.</Text>
      </View>

      <View style={styles.buttonWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#021730" />
        ) : (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={styles.appleButton}
            onPress={handleAppleLogin}
          />
        )}
        <Text style={styles.label}>로그인 시, 해당 약관에 동의한 것으로 간주합니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 116,
    paddingBottom: 18,
    paddingHorizontal: 24,
  },
  titleContainer: {
    display: 'flex',
  },
  titleWrapper: {
    display: 'flex',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'SUIT-Variable',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  subTitle: {
    fontFamily: 'SUIT Variable',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#5A6B7F',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  appleButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
  },
  label: {
    display: 'flex',
    textAlign: 'center',
    color: '#99A5B4',
    fontFamily: 'SUIT Variable',
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 16,
  },
});

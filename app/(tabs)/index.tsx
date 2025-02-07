import { Button, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Button title="회원가입" onPress={() => router.push('/login')} />
      <Button title="add-log" onPress={() => router.push('/add-log')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 56,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
});

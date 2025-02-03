import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Gender() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>성별은</Text>
        <Text style={styles.title}>어떻게 되시나요?</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#021730' : '#E8EBEF' },
          ]}
        >
          <Link href="/login/gender" asChild>
            <Text style={styles.buttonText}>여성</Text>
          </Link>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#021730' : '#E8EBEF' },
          ]}
        >
          <Link href="/login/explain" asChild>
            <Text style={styles.buttonText}>남성</Text>
          </Link>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 119,
    paddingBottom: 18,
    paddingHorizontal: 24,
  },
  titleContainer: {
    display: 'flex',
    marginBottom: 52,
  },
  title: {
    fontFamily: 'SUIT-Variable',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  buttonWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    gap: 28,
  },
  button: {
    width: '46%',
    paddingVertical: 80,
    paddingHorizontal: 60,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  buttonText: {
    fontFamily: 'SUIT Variable',
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 32,
    color: '#3A4C61',
  },
});

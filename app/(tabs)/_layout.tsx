import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <></>,
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, color }) => <></>,
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          tabBarIcon: ({ focused, color }) => <></>,
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarIcon: ({ focused, color }) => <></>,
          tabBarLabel: '',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: {
    display: 'flex',
    height: 75,
    alignContent: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '@/assets/svg/HomeIcon';
import ChartIcon from '@/assets/svg/ChartIcon';
import SearchIcon from '@/assets/svg/SearchIcon';
import HamburgerIcon from '@/assets/svg/HamburgerIcon';
import MapIcon from '@/assets/svg/MapIcon';
import * as Haptics from 'expo-haptics';
import { StyleSheet } from 'react-native';

const ACTIVE_COLOR = '#021730';
const INACTIVE_COLOR = '#99A5B4';

const styles = StyleSheet.create({
  tab: {
    display: 'flex',
    backgroundColor: '#fff',
    paddingTop: 4,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tab, { padding: insets.bottom }],
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => <HomeIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: '분석',
          tabBarIcon: ({ focused }) => (
            <ChartIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '검색',
          tabBarIcon: ({ focused }) => (
            <SearchIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
          tabBarIcon: ({ focused }) => <MapIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: '내정보',
          tabBarIcon: ({ focused }) => (
            <HamburgerIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
    </Tabs>
  );
}

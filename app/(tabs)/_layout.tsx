import React from 'react';
import { Tabs } from 'expo-router';
import HomeIcon from '@/assets/svg/HomeIcon';
import ChartIcon from '@/assets/svg/ChartIcon';
import SearchIcon from '@/assets/svg/SearchIcon';
import HamburgerIcon from '@/assets/svg/HamburgerIcon';
import { styles } from './TabLayout.styles';

const ACTIVE_COLOR = '#021730';
const INACTIVE_COLOR = '#99A5B4';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tab,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
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

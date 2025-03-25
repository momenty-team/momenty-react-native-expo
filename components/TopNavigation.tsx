import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import ChevronLeftIcon from '@/assets/svg/ChevronLeftIcon';

interface TopNavigationProps {
  children?: React.ReactNode;
  onClickBack?: () => void;
}

export default function TopNavigation({ children, onClickBack }: TopNavigationProps) {
  return (
    <View style={[styles.header]}>
      <Pressable onPress={onClickBack}>
        <ChevronLeftIcon color="#021730" />
      </Pressable>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  childrenContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

import React from 'react';
import { BlurView } from 'expo-blur';
import { View, Text, StyleSheet } from 'react-native';

type CustomToastProps = {
  text1?: string;
  text2?: string;
  icon?: React.ReactNode;
  type?: 'success' | 'error';
};

const CustomToast = ({ text1, text2, icon, type = 'success' }: CustomToastProps) => {
  return (
    <View
      style={[
        styles.toastWrapper,
        type === 'success' && styles.successToast,
        type === 'error' && styles.errorToast,
      ]}
    >
      <BlurView intensity={20} style={styles.toastContainer} tint="light">
        {icon}
        <View>
          <Text
            style={[
              styles.toastText,
              type === 'success' && { color: '#4CAF50' },
              type === 'error' && { color: '#FF4E4E' },
            ]}
          >
            {text1}
          </Text>
          {text2 && (
            <Text
              style={[
                styles.toastSubText,
                type === 'success' && { color: '#4CAF50' },
                type === 'error' && { color: '#FF4E4E' },
              ]}
            >
              {text2}
            </Text>
          )}
        </View>
      </BlurView>
    </View>
  );
};

export default CustomToast;

const styles = StyleSheet.create({
  toastWrapper: {
    overflow: 'hidden',
    borderRadius: 32,
  },
  toastContainer: {
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  successToast: {
    backgroundColor: 'rgba(229, 255, 229, 0.40)',
  },
  errorToast: {
    backgroundColor: 'rgba(255, 229, 229, 0.40)',
  },
  toastText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  toastSubText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
});

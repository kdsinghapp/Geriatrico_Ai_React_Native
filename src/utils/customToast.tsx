import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Vibration } from 'react-native';
import Toast from 'react-native-toast-message';

// ─── THEME ─────────────────────────────────────────────────────
const TOAST_THEME = {
  // Success (Green)
  successBg: '#ECFDF5',
  successText: '#065F46',
  successBorder: '#10B981',
  successIconBg: '#10B981',
  successIconText: '#FFFFFF',

  // Error (Red)
  errorBg: '#FEF2F2',
  errorText: '#7F1D1D',
  errorBorder: '#EF4444',
  errorIconBg: '#EF4444',
  errorIconText: '#FFFFFF',

  // Info (Blue)
  normalBg: '#EFF6FF',
  normalText: '#1E3A8A',
  normalBorder: '#3B82F6',
  normalIconBg: '#3B82F6',
  normalIconText: '#FFFFFF',

  shadow: '#000',
};

// ─── ICONS ─────────────────────────────────────────────────────
const SuccessIcon = () => (
  <View style={[styles.iconCircle, { backgroundColor: TOAST_THEME.successIconBg }]}>
    <Text style={[styles.iconText, { color: TOAST_THEME.successIconText }]}>✓</Text>
  </View>
);

const ErrorIcon = () => (
  <View style={[styles.iconCircle, { backgroundColor: TOAST_THEME.errorIconBg }]}>
    <Text style={[styles.iconText, { color: TOAST_THEME.errorIconText }]}>✕</Text>
  </View>
);

const InfoIcon = () => (
  <View style={[styles.iconCircle, { backgroundColor: TOAST_THEME.normalIconBg }]}>
    <Text style={[styles.iconText, { color: TOAST_THEME.normalIconText }]}>ℹ</Text>
  </View>
);

// ─── ANIMATION WRAPPER ─────────────────────────────────────────
const AnimatedToastWrapper = ({ children, style }: any) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// ─── TOAST CONFIG ──────────────────────────────────────────────
const toastConfig = {
  successResponse: ({ text1 }: any) => (
    <AnimatedToastWrapper style={styles.successContainer}>
      <SuccessIcon />
      <View style={styles.textContainer}>
        <Text style={styles.labelSuccess}>SUCCESS</Text>
        <Text style={[styles.text, { color: TOAST_THEME.successText }]}>
          {text1}
        </Text>
      </View>
    </AnimatedToastWrapper>
  ),

  errorResponse: ({ text1 }: any) => (
    <AnimatedToastWrapper style={styles.errorContainer}>
      <ErrorIcon />
      <View style={styles.textContainer}>
        <Text style={styles.labelError}>ERROR</Text>
        <Text style={[styles.text, { color: TOAST_THEME.errorText }]}>
          {text1}
        </Text>
      </View>
    </AnimatedToastWrapper>
  ),

  normalResponse: ({ text1 }: any) => (
    <AnimatedToastWrapper style={styles.infoContainer}>
      <InfoIcon />
      <View style={styles.textContainer}>
        <Text style={styles.labelInfo}>INFO</Text>
        <Text style={[styles.text, { color: TOAST_THEME.normalText }]}>
          {text1}
        </Text>
      </View>
    </AnimatedToastWrapper>
  ),
};

// ─── HELPER FUNCTIONS ──────────────────────────────────────────
export const successToast = (message: string, time = 3000) => {
  Vibration.vibrate(40);
  Toast.show({
    type: 'successResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 60,
  });
};

export const errorToast = (message: string, time = 3000) => {
  Vibration.vibrate(80);
  Toast.show({
    type: 'errorResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 60,
  });
};

export const infoToast = (message: string, time = 2500) => {
  Toast.show({
    type: 'normalResponse',
    text1: message,
    position: 'top',
    visibilityTime: time,
    topOffset: 60,
  });
};

export default toastConfig;

// ─── STYLES ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  textContainer: {
    flex: 1,
    marginLeft: 12,
  },

  text: {
    fontSize: 14,
    fontWeight: '600',
  },

  labelSuccess: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 2,
  },

  labelError: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 2,
  },

  labelInfo: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 2,
  },

  successContainer: {
    width: '95%',
    backgroundColor: TOAST_THEME.successBg,
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: TOAST_THEME.successBorder,
    elevation: 5,
  },

  errorContainer: {
    width: '92%',
    backgroundColor: TOAST_THEME.errorBg,
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: TOAST_THEME.errorBorder,
    elevation: 6,
  },

  infoContainer: {
    width: '92%',
    backgroundColor: TOAST_THEME.normalBg,
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: TOAST_THEME.normalBorder,
    elevation: 4,
  },
});
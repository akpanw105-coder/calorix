import React, { useEffect, useMemo } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { CalorixColors, CalorixRadius } from '@/constants/calorix-theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss?: () => void;
}

export function Toast({ message, type = 'success', onDismiss }: ToastProps) {
  // useMemo creates the Animated.Value once without needing .current during render
  const opacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onDismiss?.());
  }, [opacity, onDismiss]);

  const bgColor = type === 'success' ? '#111827' : type === 'error' ? '#7F1D1D' : '#1E3A5F';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  const iconColor = type === 'success' ? CalorixColors.primary : type === 'error' ? '#F87171' : '#60A5FA';

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: bgColor }]}>
      <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: CalorixRadius.full,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

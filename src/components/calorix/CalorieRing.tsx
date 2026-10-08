import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface CalorieRingProps {
  consumed: number;
  target: number;
  burned: number;
}

export function CalorieRing({ consumed, target, burned }: CalorieRingProps) {
  const remaining = Math.max(0, target - consumed + burned);
  const consumedPct = Math.min(1, consumed / target);
  const burnedPct = Math.min(0.25, burned / target);

  const size = 200;
  const cx = 100;
  const cy = 100;
  const r = 76;
  const circumference = 2 * Math.PI * r;

  // Consumed arc (green, counterclockwise is handled by SVG rotation)
  const consumedDash = circumference * consumedPct;
  const burnedDash = circumference * burnedPct;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background track */}
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={12} />
        {/* Exercise burn arc (cyan) */}
        <Circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="#0EA5E9"
          strokeWidth={12}
          strokeDasharray={`${burnedDash} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Intake arc (primary emerald) */}
        <Circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={CalorixColors.primary}
          strokeWidth={12}
          strokeDasharray={`${consumedDash} ${circumference}`}
          strokeLinecap="round"
        />
      </Svg>
      {/* Center label */}
      <View style={styles.center}>
        <Text style={styles.remainingNum}>{remaining.toLocaleString()}</Text>
        <Text style={styles.remainingLabel}>kcal remaining</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingNum: {
    fontSize: 28,
    fontWeight: '700',
    color: CalorixColors.text,
    letterSpacing: -0.5,
  },
  remainingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: CalorixColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

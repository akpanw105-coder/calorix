import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface WaterTrackerProps {
  intakeMl: number;
  goalMl: number;
  onAdd: (amount: number) => void;
}

export function WaterTracker({ intakeMl, goalMl, onAdd }: WaterTrackerProps) {
  const totalDrops = 9;
  const filledDrops = Math.round((intakeMl / goalMl) * totalDrops);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>💧</Text>
          <Text style={styles.title}>Hydration</Text>
        </View>
        <Text style={styles.amount}>
          <Text style={styles.amountValue}>{(intakeMl / 1000).toFixed(1)} L</Text>
          <Text style={styles.amountGoal}> / {(goalMl / 1000).toFixed(1)} L</Text>
        </Text>
      </View>

      {/* Water droplet array + quick add button */}
      <View style={styles.dropletRow}>
        <View style={styles.drops}>
          {Array.from({ length: totalDrops }).map((_, i) => (
            <Text key={i} style={[styles.drop, i < filledDrops ? styles.dropFilled : styles.dropEmpty]}>
              💧
            </Text>
          ))}
        </View>
        <Pressable
          onPress={() => onAdd(250)}
          style={({ pressed }) => [styles.quickAddBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.quickAddText}>+ 250ml</Text>
        </Pressable>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(100, (intakeMl / goalMl) * 100)}%` as any }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    gap: CalorixSpacing.sm,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  amount: {
    fontSize: 14,
  },
  amountValue: {
    fontWeight: '700',
    color: CalorixColors.text,
    fontSize: 14,
  },
  amountGoal: {
    color: CalorixColors.textMuted,
    fontWeight: '400',
    fontSize: 14,
  },
  dropletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drops: {
    flexDirection: 'row',
    gap: 2,
    flex: 1,
  },
  drop: {
    fontSize: 18,
  },
  dropFilled: {
    opacity: 1,
  },
  dropEmpty: {
    opacity: 0.2,
  },
  quickAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: CalorixRadius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quickAddText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F0F9FF',
    borderRadius: CalorixRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: CalorixRadius.full,
  },
});

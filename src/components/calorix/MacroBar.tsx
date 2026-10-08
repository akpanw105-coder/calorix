import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface MacroBarProps {
  protein: number;
  proteinTarget: number;
  carbs: number;
  carbsTarget: number;
  fat: number;
  fatTarget: number;
}

function MacroRow({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(1, target > 0 ? value / target : 0);
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={[styles.macroName, { color }]}>{label}</Text>
        <Text style={styles.macroValues}>
          <Text style={styles.macroValueBold}>{Math.round(value)}g</Text>
          <Text style={styles.macroValueMuted}> / {target}g</Text>
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function MacroBar({ protein, proteinTarget, carbs, carbsTarget, fat, fatTarget }: MacroBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Macronutrients</Text>
        <Text style={styles.subtitle}>Daily Targets</Text>
      </View>
      <MacroRow label="Protein" value={protein} target={proteinTarget} color="#f43f5e" />
      <MacroRow label="Carbohydrates" value={carbs} target={carbsTarget} color="#f59e0b" />
      <MacroRow label="Fats" value={fat} target={fatTarget} color="#0ea5e9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    gap: CalorixSpacing.md,
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  subtitle: {
    fontSize: 11,
    color: CalorixColors.textMuted,
  },
  macroRow: {
    gap: 6,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroName: {
    fontSize: 12,
    fontWeight: '600',
  },
  macroValues: {
    fontSize: 12,
  },
  macroValueBold: {
    fontWeight: '700',
    color: CalorixColors.text,
    fontSize: 12,
  },
  macroValueMuted: {
    color: CalorixColors.textMuted,
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: CalorixRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: CalorixRadius.full,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { formatDisplayDate } from '@/constants/mock-data';

interface DateSelectorProps {
  currentDate: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function DateSelector({ currentDate, onPrev, onNext, onToday }: DateSelectorProps) {
  const { label } = formatDisplayDate(currentDate);
  const today = new Date().toISOString().split('T')[0];
  const isToday = currentDate === today;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrev}
        style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}
        accessibilityLabel="Previous day"
      >
        <Text style={styles.chevron}>‹</Text>
      </Pressable>

      <Pressable
        onPress={onToday}
        style={({ pressed }) => [styles.datePill, pressed && styles.pressed]}
      >
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={styles.dateLabel}>{label}</Text>
        {!isToday && <Text style={styles.todayHint}>↩</Text>}
      </Pressable>

      <Pressable
        onPress={onNext}
        style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}
        accessibilityLabel="Next day"
      >
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    paddingHorizontal: CalorixSpacing.md,
    paddingVertical: CalorixSpacing.sm,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CalorixRadius.md,
  },
  pressed: {
    opacity: 0.6,
  },
  chevron: {
    fontSize: 24,
    color: CalorixColors.textSecondary,
    fontWeight: '300',
    lineHeight: 28,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: CalorixRadius.full,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  calendarIcon: {
    fontSize: 14,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    letterSpacing: -0.3,
  },
  todayHint: {
    fontSize: 14,
    color: CalorixColors.primary,
  },
});

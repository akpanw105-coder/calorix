import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { ExerciseLogItem } from '@/types/calorix';

interface ActivityCardProps {
  exercises: ExerciseLogItem[];
  onAddExercise: () => void;
  onRemove?: (id: string) => void;
}

export function ActivityCard({ exercises, onAddExercise, onRemove }: ActivityCardProps) {
  const totalCalories = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const totalMinutes = exercises.reduce((sum, e) => sum + e.durationMinutes, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={styles.title}>Activity</Text>
        </View>
        <Pressable
          onPress={onAddExercise}
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.addBtnText}>+ Log Exercise</Text>
        </Pressable>
      </View>

      {exercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏃</Text>
          <Text style={styles.emptyText}>No activity logged yet</Text>
          <Text style={styles.emptySubtext}>Tap + Log Exercise to track your workout</Text>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {/* Summary bar */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCalories}</Text>
              <Text style={styles.summaryLabel}>kcal burned</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalMinutes}</Text>
              <Text style={styles.summaryLabel}>min active</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{exercises.length}</Text>
              <Text style={styles.summaryLabel}>workouts</Text>
            </View>
          </View>

          {/* Individual exercises */}
          {exercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <View style={styles.exerciseIcon}>
                <Text style={styles.exerciseIconText}>
                  {exercise.category === 'Running' ? '🏃' :
                   exercise.category === 'Cycling' ? '🚴' :
                   exercise.category === 'Swimming' ? '🏊' :
                   exercise.category === 'Strength' ? '💪' : '⚡'}
                </Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.title}</Text>
                <Text style={styles.exerciseMeta}>{exercise.durationMinutes} min · {exercise.caloriesBurned} kcal</Text>
              </View>
              {onRemove && (
                <Pressable
                  onPress={() => onRemove(exercise.id)}
                  style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.5 }]}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}
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
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: CalorixColors.primaryLight,
    borderRadius: CalorixRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: CalorixColors.primaryHover,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: CalorixSpacing.lg,
    gap: 4,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  emptySubtext: {
    fontSize: 12,
    color: CalorixColors.textMuted,
    textAlign: 'center',
  },
  exerciseList: {
    gap: CalorixSpacing.sm,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: CalorixRadius.lg,
    padding: CalorixSpacing.sm,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  summaryLabel: {
    fontSize: 10,
    color: CalorixColors.textMuted,
    textTransform: 'uppercase',
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalorixSpacing.sm,
    padding: CalorixSpacing.sm,
    backgroundColor: '#FAFAFA',
    borderRadius: CalorixRadius.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: CalorixRadius.md,
    backgroundColor: CalorixColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIconText: {
    fontSize: 20,
  },
  exerciseInfo: {
    flex: 1,
    gap: 2,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  exerciseMeta: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
  removeBtn: {
    padding: 6,
    borderRadius: CalorixRadius.sm,
    backgroundColor: '#F3F4F6',
  },
  removeBtnText: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
});

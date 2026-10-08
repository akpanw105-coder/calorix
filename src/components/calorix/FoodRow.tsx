import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MealLogItem, MealType } from '@/types/calorix';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface FoodRowProps {
  meal: MealLogItem;
  onRemove?: (id: string) => void;
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

export function FoodRow({ meal, onRemove }: FoodRowProps) {
  return (
    <View style={styles.container}>
      {meal.imageUrl ? (
        <Image source={{ uri: meal.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderIcon}>🍽️</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.mealType}>{mealTypeLabels[meal.mealType]}</Text>
          <Text style={styles.calories}>{meal.calories} kcal</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{meal.name}</Text>
        <View style={styles.macros}>
          <Text style={styles.macroText}>P: {meal.protein}g</Text>
          <Text style={styles.macroDot}>•</Text>
          <Text style={styles.macroText}>C: {meal.carbs}g</Text>
          <Text style={styles.macroDot}>•</Text>
          <Text style={styles.macroText}>F: {meal.fat}g</Text>
        </View>
      </View>
      {onRemove && (
        <View style={styles.actions}>
          <Text style={styles.checkIcon}>✓</Text>
          <Pressable
            onPress={() => onRemove(meal.id)}
            style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
            accessibilityLabel={`Remove ${meal.name}`}
          >
            <Text style={styles.removeBtnText}>✕</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

interface EmptyMealCardProps {
  mealType: MealType;
  onAdd: () => void;
}

export function EmptyMealCard({ mealType, onAdd }: EmptyMealCardProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyLeft}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>🍽️</Text>
        </View>
        <View>
          <Text style={styles.mealType}>{mealTypeLabels[mealType]}</Text>
          <Text style={styles.notLogged}>Not logged yet</Text>
        </View>
      </View>
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.addButtonText}>+ Log</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalorixSpacing.md,
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: CalorixRadius.md,
  },
  imagePlaceholder: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calories: {
    fontSize: 12,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  macros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  macroText: {
    fontSize: 11,
    color: CalorixColors.textMuted,
  },
  macroDot: {
    fontSize: 11,
    color: CalorixColors.textMuted,
  },
  actions: {
    alignItems: 'center',
    gap: 6,
  },
  checkIcon: {
    fontSize: 18,
    color: CalorixColors.primary,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  removeBtnText: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalorixSpacing.md,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: CalorixRadius.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconText: {
    fontSize: 24,
  },
  notLogged: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: CalorixColors.primary,
    borderRadius: CalorixRadius.full,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
  ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { MealType } from '@/types/calorix';
import { INITIAL_FOOD_DATABASE, FOOD_CATEGORIES } from '@/constants/mock-data';

interface LogFoodModalProps {
  visible: boolean;
  defaultMealType?: MealType;
  onClose: () => void;
  onAdd: (food: {
    foodId: string;
    name: string;
    mealType: MealType;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion: string;
    imageUrl?: string;
  }) => void;
}

const MEAL_TYPES: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

export function LogFoodModal({ visible, defaultMealType = 'lunch', onClose, onAdd }: LogFoodModalProps) {
  const [query, setQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>(defaultMealType);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = INITIAL_FOOD_DATABASE.filter(f => {
    const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  function handleAdd(food: typeof INITIAL_FOOD_DATABASE[number]) {
    onAdd({
      foodId: food.id,
      name: food.name,
      mealType: selectedMealType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      portion: food.portion,
      imageUrl: food.imageUrl,
    });
    setQuery('');
    setSelectedCategory('All');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log Food</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Meal type selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealTypeScroll} contentContainerStyle={styles.mealTypeContainer}>
            {MEAL_TYPES.map(mt => (
              <Pressable
                key={mt.key}
                onPress={() => setSelectedMealType(mt.key)}
                style={[styles.mealTypePill, selectedMealType === mt.key && styles.mealTypePillActive]}
              >
                <Text style={[styles.mealTypePillText, selectedMealType === mt.key && styles.mealTypePillTextActive]}>
                  {mt.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              placeholderTextColor={CalorixColors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Category filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContainer}>
            {FOOD_CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
              >
                <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Food list */}
          <ScrollView style={styles.foodList} contentContainerStyle={styles.foodListContent}>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🥗</Text>
                <Text style={styles.emptyText}>No foods found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            ) : (
              filtered.map(food => (
                <Pressable
                  key={food.id}
                  onPress={() => handleAdd(food)}
                  style={({ pressed }) => [styles.foodItem, pressed && styles.foodItemPressed]}
                >
                  <View style={styles.foodItemLeft}>
                    <View style={styles.foodBadge}>
                      <Text style={styles.foodBadgeText}>{food.category[0]}</Text>
                    </View>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodPortion}>{food.portion}</Text>
                      <View style={styles.foodMacros}>
                        <Text style={styles.macroItem}>P: {food.protein}g</Text>
                        <Text style={styles.macroDot}>·</Text>
                        <Text style={styles.macroItem}>C: {food.carbs}g</Text>
                        <Text style={styles.macroDot}>·</Text>
                        <Text style={styles.macroItem}>F: {food.fat}g</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.foodItemRight}>
                    <Text style={styles.foodCalories}>{food.calories}</Text>
                    <Text style={styles.foodCalLabel}>kcal</Text>
                    <View style={styles.addCircle}>
                      <Text style={styles.addCircleText}>+</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CalorixColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CalorixSpacing.md,
    paddingTop: CalorixSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: CalorixColors.cardBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: CalorixColors.textSecondary,
    fontWeight: '600',
  },
  mealTypeScroll: {
    flexGrow: 0,
    marginTop: CalorixSpacing.sm,
  },
  mealTypeContainer: {
    paddingHorizontal: CalorixSpacing.md,
    gap: 8,
    flexDirection: 'row',
  },
  mealTypePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: CalorixRadius.full,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    backgroundColor: CalorixColors.surface,
  },
  mealTypePillActive: {
    backgroundColor: CalorixColors.primary,
    borderColor: CalorixColors.primary,
  },
  mealTypePillText: {
    fontSize: 13,
    fontWeight: '500',
    color: CalorixColors.textSecondary,
  },
  mealTypePillTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: CalorixSpacing.md,
    marginBottom: 8,
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    paddingHorizontal: CalorixSpacing.md,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: CalorixColors.text,
  },
  clearBtn: {
    fontSize: 14,
    color: CalorixColors.textMuted,
    padding: 4,
  },
  catScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  catContainer: {
    paddingHorizontal: CalorixSpacing.md,
    gap: 6,
    flexDirection: 'row',
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: CalorixRadius.full,
    backgroundColor: '#F3F4F6',
  },
  catPillActive: {
    backgroundColor: CalorixColors.primaryLight,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: CalorixColors.textSecondary,
  },
  catPillTextActive: {
    color: CalorixColors.primaryHover,
    fontWeight: '700',
  },
  foodList: {
    flex: 1,
  },
  foodListContent: {
    padding: CalorixSpacing.md,
    paddingTop: 4,
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    color: CalorixColors.textMuted,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
  },
  foodItemPressed: {
    backgroundColor: CalorixColors.primaryLight,
    borderColor: CalorixColors.primaryBorder,
  },
  foodItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalorixSpacing.sm,
    flex: 1,
  },
  foodBadge: {
    width: 40,
    height: 40,
    borderRadius: CalorixRadius.md,
    backgroundColor: CalorixColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  foodInfo: {
    flex: 1,
    gap: 2,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  foodPortion: {
    fontSize: 11,
    color: CalorixColors.textMuted,
  },
  foodMacros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  macroItem: {
    fontSize: 10,
    color: CalorixColors.textMuted,
  },
  macroDot: {
    color: CalorixColors.textMuted,
    fontSize: 10,
  },
  foodItemRight: {
    alignItems: 'center',
    gap: 2,
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  foodCalLabel: {
    fontSize: 10,
    color: CalorixColors.textMuted,
    textTransform: 'uppercase',
  },
  addCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: CalorixColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addCircleText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 22,
  },
});

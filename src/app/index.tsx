import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { CalorieRing } from '@/components/calorix/CalorieRing';
import { DateSelector } from '@/components/calorix/DateSelector';
import { MacroBar } from '@/components/calorix/MacroBar';
import { FoodRow, EmptyMealCard } from '@/components/calorix/FoodRow';
import { WaterTracker } from '@/components/calorix/WaterTracker';
import { ActivityCard } from '@/components/calorix/ActivityCard';
import { LogFoodModal } from '@/components/calorix/LogFoodModal';
import { LogExerciseModal } from '@/components/calorix/LogExerciseModal';
import { AddWaterModal } from '@/components/calorix/AddWaterModal';
import { ScanFoodModal } from '@/components/calorix/ScanFoodModal';
import { GlobalAddModal } from '@/components/calorix/GlobalAddModal';
import { Toast } from '@/components/calorix/Toast';
import { BrandLogo } from '@/components/calorix/BrandLogo';
import { MealType } from '@/types/calorix';

export default function HomeScreen() {
  const {
    profile,
    currentDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    getCurrentDayData,
    getTotalCaloriesConsumed,
    getTotalCaloriesBurned,
    getCaloriesRemaining,
    getMacroTotals,
    addMealEntry,
    removeMealEntry,
    addWater,
    addExercise,
    removeExercise,
    refreshDayData,
    toast,
    showToast,
    clearToast,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [logFoodVisible, setLogFoodVisible] = useState(false);
  const [targetMealType, setTargetMealType] = useState<MealType>('breakfast');
  const [logExerciseVisible, setLogExerciseVisible] = useState(false);
  const [addWaterVisible, setAddWaterVisible] = useState(false);
  const [scanFoodVisible, setScanFoodVisible] = useState(false);
  const [globalAddVisible, setGlobalAddVisible] = useState(false);

  const dayData = getCurrentDayData();
  const consumed = getTotalCaloriesConsumed();
  const burned = getTotalCaloriesBurned();
  const remaining = getCaloriesRemaining();
  const macros = getMacroTotals();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshDayData();
      showToast('Telemetry refreshed from Supabase', 'info');
    } catch {
      showToast('Telemetry refreshed', 'info');
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenLogFood = (mealType: MealType) => {
    setTargetMealType(mealType);
    setLogFoodVisible(true);
  };

  const handleGlobalAction = (action: 'food' | 'scan' | 'exercise' | 'water') => {
    setGlobalAddVisible(false);
    if (action === 'food') setLogFoodVisible(true);
    if (action === 'scan') setScanFoodVisible(true);
    if (action === 'exercise') setLogExerciseVisible(true);
    if (action === 'water') setAddWaterVisible(true);
  };

  // Group meals by mealType
  const breakfastMeals = dayData.meals.filter((m) => m.mealType === 'breakfast');
  const lunchMeals = dayData.meals.filter((m) => m.mealType === 'lunch');
  const dinnerMeals = dayData.meals.filter((m) => m.mealType === 'dinner');
  const snacksMeals = dayData.meals.filter((m) => m.mealType === 'snacks');

  return (
    <SafeAreaView style={styles.safeArea}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={clearToast}
        />
      )}

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BrandLogo variant="full" width={140} height={28} />
        </View>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => showToast('All telemetry synced', 'info')}
            style={({ pressed }) => [styles.headerBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.headerBtnIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </Pressable>

          <View style={styles.avatarWrapper}>
            {profile.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.headerAvatar}
              />
            ) : (
              <View style={[styles.headerAvatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={CalorixColors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selector */}
        <DateSelector
          currentDate={currentDate}
          onPrev={goToPreviousDay}
          onNext={goToNextDay}
          onToday={goToToday}
        />

        {/* Hero Calorie Budget Gauge Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroTitleRow}>
              <Text style={styles.heroBolt}>⚡</Text>
              <Text style={styles.heroTitle}>Energy Budget</Text>
            </View>
          </View>

          {/* Calorie Ring */}
          <View style={styles.ringCenterWrap}>
            <CalorieRing
              consumed={consumed}
              target={dayData.calorieTarget}
              burned={burned}
            />
          </View>

          {/* Sub-stats Telemetry Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>TARGET</Text>
              <Text style={styles.statValue}>{dayData.calorieTarget.toLocaleString()}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>FOOD</Text>
              <Text style={[styles.statValue, { color: CalorixColors.primary }]}>
                {consumed.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>EXERCISE</Text>
              <Text style={[styles.statValue, { color: '#0284C7' }]}>
                -{burned.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Macronutrients Trio */}
        <MacroBar
          protein={macros.protein}
          proteinTarget={profile.proteinTarget}
          carbs={macros.carbs}
          carbsTarget={profile.carbsTarget}
          fat={macros.fat}
          fatTarget={profile.fatTarget}
        />

        {/* AI Daily Recommendation Pill */}
        <View style={styles.aiPillCard}>
          <View style={styles.aiIconBubble}>
            <Text style={styles.aiIcon}>✨</Text>
          </View>
          <View style={styles.aiContent}>
            <Text style={styles.aiTag}>ADAPTIVE INSIGHT</Text>
            <Text style={styles.aiMessage}>
              Post-workout protein boost recommended.{' '}
              <Text style={styles.aiMessageBold}>
                {Math.max(0, profile.proteinTarget - Math.round(macros.protein))}g remaining
              </Text>{' '}
              to hit synthesis target.
            </Text>
          </View>
        </View>

        {/* Meals Logged Stream */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meals Logged</Text>
            <Text style={styles.sectionSub}>
              {dayData.meals.length} recorded
            </Text>
          </View>

          {/* Breakfast */}
          {breakfastMeals.length > 0 ? (
            breakfastMeals.map((m) => (
              <FoodRow key={m.id} meal={m} onRemove={removeMealEntry} />
            ))
          ) : (
            <EmptyMealCard
              mealType="breakfast"
              onAdd={() => handleOpenLogFood('breakfast')}
            />
          )}

          {/* Lunch */}
          {lunchMeals.length > 0 ? (
            lunchMeals.map((m) => (
              <FoodRow key={m.id} meal={m} onRemove={removeMealEntry} />
            ))
          ) : (
            <EmptyMealCard
              mealType="lunch"
              onAdd={() => handleOpenLogFood('lunch')}
            />
          )}

          {/* Dinner */}
          {dinnerMeals.length > 0 ? (
            dinnerMeals.map((m) => (
              <FoodRow key={m.id} meal={m} onRemove={removeMealEntry} />
            ))
          ) : (
            <EmptyMealCard
              mealType="dinner"
              onAdd={() => handleOpenLogFood('dinner')}
            />
          )}

          {/* Snacks */}
          {snacksMeals.length > 0 ? (
            snacksMeals.map((m) => (
              <FoodRow key={m.id} meal={m} onRemove={removeMealEntry} />
            ))
          ) : (
            <EmptyMealCard
              mealType="snacks"
              onAdd={() => handleOpenLogFood('snacks')}
            />
          )}
        </View>

        {/* Water Tracker */}
        <WaterTracker
          intakeMl={dayData.waterIntakeMl}
          goalMl={dayData.waterGoalMl}
          onAdd={(amount) => {
            addWater(amount);
            showToast(`+${amount}ml water added!`, 'success');
          }}
        />

        {/* Activity Card */}
        <ActivityCard
          exercises={dayData.exercises}
          onAddExercise={() => setLogExerciseVisible(true)}
          onRemove={(id) => {
            removeExercise(id);
            showToast('Workout entry removed', 'info');
          }}
        />

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Action Button for Quick Log */}
      <View style={styles.floatingActionContainer} pointerEvents="box-none">
        <Pressable
          onPress={() => setGlobalAddVisible(true)}
          style={({ pressed }) => [styles.floatingAddBtn, pressed && styles.btnPressed]}
          accessibilityLabel="Quick log modal"
        >
          <Text style={styles.floatingAddIcon}>+</Text>
        </Pressable>
      </View>

      {/* Modals */}
      <GlobalAddModal
        visible={globalAddVisible}
        onClose={() => setGlobalAddVisible(false)}
        onSelectAction={handleGlobalAction}
      />

      <LogFoodModal
        visible={logFoodVisible}
        defaultMealType={targetMealType}
        onClose={() => setLogFoodVisible(false)}
        onAdd={(food) => {
          addMealEntry({
            foodId: food.foodId,
            name: food.name,
            mealType: food.mealType,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            portion: food.portion,
            loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            imageUrl: food.imageUrl,
          });
          showToast(`Logged ${food.name}`, 'success');
        }}
      />

      <LogExerciseModal
        visible={logExerciseVisible}
        onClose={() => setLogExerciseVisible(false)}
        onAdd={(ex) => {
          addExercise(ex);
          showToast(`Workout logged: ${ex.title}`, 'success');
        }}
      />

      <AddWaterModal
        visible={addWaterVisible}
        currentIntakeMl={dayData.waterIntakeMl}
        goalMl={dayData.waterGoalMl}
        onClose={() => setAddWaterVisible(false)}
        onAdd={(amount) => {
          addWater(amount);
          showToast(`+${amount}ml hydration recorded!`, 'success');
        }}
      />

      <ScanFoodModal
        visible={scanFoodVisible}
        onClose={() => setScanFoodVisible(false)}
        onAdd={(item) => {
          addMealEntry({
            foodId: item.foodId,
            name: item.name,
            mealType: 'snacks',
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            portion: item.portion,
            loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          showToast(`AI Identified: ${item.name}`, 'success');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CalorixColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CalorixSpacing.md,
    paddingVertical: CalorixSpacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBtnIcon: {
    fontSize: 16,
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: CalorixColors.primary,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 15,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CalorixSpacing.md,
    gap: CalorixSpacing.md,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(5, 150, 105, 0.06)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CalorixSpacing.xs,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBolt: {
    fontSize: 18,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  optimalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: CalorixRadius.full,
  },
  optimalText: {
    fontSize: 10,
    fontWeight: '800',
    color: CalorixColors.primary,
    letterSpacing: 0.5,
  },
  ringCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: CalorixSpacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: CalorixSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: CalorixColors.textMuted,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: CalorixColors.text,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
  },
  aiPillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CalorixSpacing.md,
    backgroundColor: 'rgba(236, 253, 245, 0.8)',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
  },
  aiIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIcon: {
    fontSize: 18,
  },
  aiContent: {
    flex: 1,
    gap: 2,
  },
  aiTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  aiMessage: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  aiMessageBold: {
    fontWeight: '700',
    color: '#111827',
  },
  mealsSection: {
    gap: CalorixSpacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
  floatingActionContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    zIndex: 999,
  },
  floatingAddBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: CalorixColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: CalorixColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingAddIcon: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 34,
  },
});

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, DailyData, MealLogItem, ExerciseLogItem, AIPersonalizationResult } from '@/types/calorix';
import { INITIAL_USER_PROFILE, getDateOffset } from '@/constants/mock-data';
import { useAuth } from '@/services/AuthContext';
import {
  fetchUserProfile,
  FetchedProfile,
  upsertUserProfile,
  fetchFoodLogsForDate,
  insertFoodLog,
  deleteFoodLog,
  fetchWaterLogsForDate,
  insertWaterLog,
  resetOrSetWaterLogs,
  fetchExerciseLogsForDate,
  insertExerciseLog,
  deleteExerciseLog,
  recordWeightLog,
  fetchRangeTelemetry,
  DayTelemetrySummary,
  uploadAvatar,
} from '@/services/database';

interface AppState {
  profile: UserProfile;
  currentDate: string;
  daysData: Record<string, DailyData>;
  hasCompletedOnboarding: boolean;
  aiPlan: AIPersonalizationResult | null;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  isLoadingData: boolean;
}

interface AppContextValue extends AppState {
  // Profile
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setCalorieTarget: (target: number) => Promise<void>;
  updateAvatar: (blob: Blob | ArrayBuffer, ext: string) => Promise<string>;

  // Date navigation
  setCurrentDate: (date: string) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  goToToday: () => void;

  // Meals
  addMealEntry: (item: Omit<MealLogItem, 'id'>) => Promise<void>;
  removeMealEntry: (id: string) => Promise<void>;

  // Water
  addWater: (amountMl: number) => Promise<void>;
  setWaterIntake: (amountMl: number) => Promise<void>;

  // Exercise
  addExercise: (exercise: Omit<ExerciseLogItem, 'id'>) => Promise<void>;
  removeExercise: (id: string) => Promise<void>;

  // Derived helpers
  getCurrentDayData: () => DailyData;
  getTotalCaloriesConsumed: (date?: string) => number;
  getTotalCaloriesBurned: (date?: string) => number;
  getCaloriesRemaining: (date?: string) => number;
  getMacroTotals: (date?: string) => { protein: number; carbs: number; fat: number };

  // Analytics query
  getRangeData: (startDate: string, endDate: string) => Promise<DayTelemetrySummary[]>;

  // Onboarding
  completeOnboarding: (profileData: Partial<UserProfile>, plan: AIPersonalizationResult) => Promise<void>;

  // Toast
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  // Manual refresh
  refreshDayData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function makeEmptyDay(date: string, profile: UserProfile): DailyData {
  return {
    date,
    calorieTarget: profile.calorieTarget,
    waterIntakeMl: 0,
    waterGoalMl: profile.waterGoalMl,
    weightKg: profile.currentWeightKg,
    meals: [],
    exercises: [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [currentDate, setCurrentDate] = useState<string>(getDateOffset(0));
  const [daysData, setDaysData] = useState<Record<string, DailyData>>({});
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [aiPlan, setAiPlan] = useState<AIPersonalizationResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // 1. When user logs in or changes, load profile
  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!user) {
        // Clear sensitive state on logout
        setProfile(INITIAL_USER_PROFILE);
        setDaysData({});
        setHasCompletedOnboarding(false);
        return;
      }

      setIsLoadingData(true);
      try {
        const fetched: FetchedProfile | null = await fetchUserProfile(user.id);
        if (!active) return;

        if (fetched) {
          setProfile(fetched.profile);
          setHasCompletedOnboarding(fetched.hasCompletedOnboarding);
        } else {
          // New user — no profile row yet; prompt onboarding
          const initialNewProfile: UserProfile = {
            ...INITIAL_USER_PROFILE,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Calorix User',
            username: user.user_metadata?.username || user.email?.split('@')[0] || 'calorix_user',
            email: user.email || '',
          };
          setProfile(initialNewProfile);
          setHasCompletedOnboarding(false);
        }
      } catch (err: any) {
        console.error('[CALORIX] Error loading profile from Supabase:', err);
      } finally {
        if (active) setIsLoadingData(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [user]);

  // 2. Fetch daily data for currentDate
  const fetchDayLogs = useCallback(
    async (date: string, userProfile: UserProfile) => {
      if (!user) return;

      try {
        const [meals, waterMl, exercises] = await Promise.all([
          fetchFoodLogsForDate(user.id, date),
          fetchWaterLogsForDate(user.id, date),
          fetchExerciseLogsForDate(user.id, date),
        ]);

        setDaysData(prev => ({
          ...prev,
          [date]: {
            date,
            calorieTarget: userProfile.calorieTarget,
            waterIntakeMl: waterMl,
            waterGoalMl: userProfile.waterGoalMl,
            weightKg: userProfile.currentWeightKg,
            meals,
            exercises,
          },
        }));
      } catch (err) {
        console.error('[CALORIX] Error fetching day logs:', err);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user && hasCompletedOnboarding) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDayLogs(currentDate, profile);
    }
  }, [user, currentDate, hasCompletedOnboarding, profile, fetchDayLogs]);

  // Navigation callbacks
  const goToPreviousDay = useCallback(() => {
    setCurrentDate(prev => {
      const d = new Date(prev + 'T12:00:00');
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate(prev => {
      const d = new Date(prev + 'T12:00:00');
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(getDateOffset(0));
  }, []);

  // Profile operations
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      setProfile(prev => ({ ...prev, ...updates }));

      if (user) {
        try {
          const updated = await upsertUserProfile(user.id, updates);
          setProfile(updated);
          if (updates.currentWeightKg !== undefined) {
            await recordWeightLog(user.id, updates.currentWeightKg, currentDate);
          }
        } catch (err) {
          console.error('[CALORIX] Error saving profile:', err);
          showToast('Failed to save profile changes to cloud', 'error');
        }
      }
    },
    [user, currentDate, showToast]
  );

  const setCalorieTarget = useCallback(
    async (target: number) => {
      await updateProfile({ calorieTarget: target });
      setDaysData(prev => {
        if (prev[currentDate]) {
          return { ...prev, [currentDate]: { ...prev[currentDate], calorieTarget: target } };
        }
        return prev;
      });
    },
    [updateProfile, currentDate]
  );

  const updateAvatar = useCallback(
    async (blob: Blob | ArrayBuffer, ext: string): Promise<string> => {
      if (!user) throw new Error('Not authenticated');
      const publicUrl = await uploadAvatar(user.id, blob, ext);
      await updateProfile({ avatarUrl: publicUrl });
      return publicUrl;
    },
    [user, updateProfile]
  );

  // Meal operations
  const addMealEntry = useCallback(
    async (item: Omit<MealLogItem, 'id'>) => {
      if (!user) return;

      try {
        const savedItem = await insertFoodLog(user.id, currentDate, item);
        setDaysData(prev => {
          const currentDay = prev[currentDate] || makeEmptyDay(currentDate, profile);
          return {
            ...prev,
            [currentDate]: {
              ...currentDay,
              meals: [...currentDay.meals, savedItem],
            },
          };
        });
        showToast(`Logged ${savedItem.name}`, 'success');
      } catch (err) {
        console.error('[CALORIX] Failed to insert meal:', err);
        showToast('Failed to save food log', 'error');
      }
    },
    [user, currentDate, profile, showToast]
  );

  const removeMealEntry = useCallback(
    async (id: string) => {
      // Optimistic update
      setDaysData(prev => {
        const dayData = prev[currentDate];
        if (!dayData) return prev;
        return {
          ...prev,
          [currentDate]: {
            ...dayData,
            meals: dayData.meals.filter(m => m.id !== id),
          },
        };
      });

      if (user) {
        try {
          await deleteFoodLog(id);
          showToast('Food entry removed', 'info');
        } catch (err) {
          console.error('[CALORIX] Failed to delete meal:', err);
          showToast('Failed to delete meal from cloud', 'error');
        }
      }
    },
    [user, currentDate, showToast]
  );

  // Water operations
  const addWater = useCallback(
    async (amountMl: number) => {
      // Optimistic update
      setDaysData(prev => {
        const currentDay = prev[currentDate] || makeEmptyDay(currentDate, profile);
        return {
          ...prev,
          [currentDate]: {
            ...currentDay,
            waterIntakeMl: currentDay.waterIntakeMl + amountMl,
          },
        };
      });

      if (user) {
        try {
          await insertWaterLog(user.id, currentDate, amountMl);
          showToast(`+${amountMl}ml water logged`, 'success');
        } catch (err) {
          console.error('[CALORIX] Failed to log water:', err);
          showToast('Failed to log water', 'error');
        }
      }
    },
    [user, currentDate, profile, showToast]
  );

  const setWaterIntake = useCallback(
    async (amountMl: number) => {
      setDaysData(prev => {
        const currentDay = prev[currentDate] || makeEmptyDay(currentDate, profile);
        return {
          ...prev,
          [currentDate]: {
            ...currentDay,
            waterIntakeMl: Math.max(0, amountMl),
          },
        };
      });

      if (user) {
        try {
          await resetOrSetWaterLogs(user.id, currentDate, Math.max(0, amountMl));
        } catch (err) {
          console.error('[CALORIX] Failed to update water intake:', err);
        }
      }
    },
    [user, currentDate, profile]
  );

  // Exercise operations
  const addExercise = useCallback(
    async (exercise: Omit<ExerciseLogItem, 'id'>) => {
      if (!user) return;

      try {
        const savedExercise = await insertExerciseLog(user.id, currentDate, exercise);
        setDaysData(prev => {
          const currentDay = prev[currentDate] || makeEmptyDay(currentDate, profile);
          return {
            ...prev,
            [currentDate]: {
              ...currentDay,
              exercises: [...currentDay.exercises, savedExercise],
            },
          };
        });
        showToast(`Logged ${savedExercise.title} (${savedExercise.caloriesBurned} kcal)`, 'success');
      } catch (err) {
        console.error('[CALORIX] Failed to insert exercise:', err);
        showToast('Failed to save exercise log', 'error');
      }
    },
    [user, currentDate, profile, showToast]
  );

  const removeExercise = useCallback(
    async (id: string) => {
      setDaysData(prev => {
        const dayData = prev[currentDate];
        if (!dayData) return prev;
        return {
          ...prev,
          [currentDate]: {
            ...dayData,
            exercises: dayData.exercises.filter(e => e.id !== id),
          },
        };
      });

      if (user) {
        try {
          await deleteExerciseLog(id);
          showToast('Exercise removed', 'info');
        } catch (err) {
          console.error('[CALORIX] Failed to delete exercise:', err);
          showToast('Failed to delete exercise', 'error');
        }
      }
    },
    [user, currentDate, showToast]
  );

  // Derived helpers
  const getCurrentDayData = useCallback((): DailyData => {
    return daysData[currentDate] || makeEmptyDay(currentDate, profile);
  }, [daysData, currentDate, profile]);

  const getTotalCaloriesConsumed = useCallback(
    (date?: string): number => {
      const d = date || currentDate;
      const dayData = daysData[d];
      if (!dayData) return 0;
      return dayData.meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
    },
    [daysData, currentDate]
  );

  const getTotalCaloriesBurned = useCallback(
    (date?: string): number => {
      const d = date || currentDate;
      const dayData = daysData[d];
      if (!dayData) return 0;
      return dayData.exercises.reduce((sum, e) => sum + (Number(e.caloriesBurned) || 0), 0);
    },
    [daysData, currentDate]
  );

  const getCaloriesRemaining = useCallback(
    (date?: string): number => {
      const d = date || currentDate;
      const dayData = daysData[d];
      const target = dayData?.calorieTarget ?? profile.calorieTarget;
      const consumed = getTotalCaloriesConsumed(d);
      const burned = getTotalCaloriesBurned(d);
      return target - consumed + burned;
    },
    [daysData, currentDate, profile, getTotalCaloriesConsumed, getTotalCaloriesBurned]
  );

  const getMacroTotals = useCallback(
    (date?: string) => {
      const d = date || currentDate;
      const dayData = daysData[d];
      if (!dayData) return { protein: 0, carbs: 0, fat: 0 };
      return dayData.meals.reduce(
        (acc, m) => ({
          protein: acc.protein + (Number(m.protein) || 0),
          carbs: acc.carbs + (Number(m.carbs) || 0),
          fat: acc.fat + (Number(m.fat) || 0),
        }),
        { protein: 0, carbs: 0, fat: 0 }
      );
    },
    [daysData, currentDate]
  );

  const getRangeData = useCallback(
    async (startDate: string, endDate: string): Promise<DayTelemetrySummary[]> => {
      if (!user) return [];
      return await fetchRangeTelemetry(user.id, startDate, endDate);
    },
    [user]
  );

  // Onboarding completion
  const completeOnboarding = useCallback(
    async (profileData: Partial<UserProfile>, plan: AIPersonalizationResult) => {
      const merged: UserProfile = {
        ...profile,
        ...profileData,
        calorieTarget: plan.calorieTarget,
        proteinTarget: plan.proteinGrams,
        carbsTarget: plan.carbsGrams,
        fatTarget: plan.fatGrams,
        waterGoalMl: plan.waterTargetMl,
      };

      setProfile(merged);
      setAiPlan(plan);
      setHasCompletedOnboarding(true);

      if (user) {
        try {
          await upsertUserProfile(user.id, {
            ...profileData,
            calorieTarget: plan.calorieTarget,
            proteinTarget: plan.proteinGrams,
            carbsTarget: plan.carbsGrams,
            fatTarget: plan.fatGrams,
            waterGoalMl: plan.waterTargetMl,
          });
          if (profileData.currentWeightKg) {
            await recordWeightLog(user.id, profileData.currentWeightKg, currentDate);
          }
          showToast('Health profile activated & synchronized!', 'success');
        } catch (err) {
          console.error('[CALORIX] Error saving onboarding profile:', err);
          showToast('Plan set locally. Check network for cloud sync.', 'info');
        }
      }
    },
    [profile, user, currentDate, showToast]
  );

  const refreshDayData = useCallback(async () => {
    if (user) {
      await fetchDayLogs(currentDate, profile);
    }
  }, [user, currentDate, profile, fetchDayLogs]);

  return (
    <AppContext.Provider
      value={{
        profile,
        currentDate,
        daysData,
        hasCompletedOnboarding,
        aiPlan,
        toast,
        isLoadingData,
        updateProfile,
        setCalorieTarget,
        updateAvatar,
        setCurrentDate,
        goToPreviousDay,
        goToNextDay,
        goToToday,
        addMealEntry,
        removeMealEntry,
        addWater,
        setWaterIntake,
        addExercise,
        removeExercise,
        getCurrentDayData,
        getTotalCaloriesConsumed,
        getTotalCaloriesBurned,
        getCaloriesRemaining,
        getMacroTotals,
        getRangeData,
        completeOnboarding,
        showToast,
        clearToast,
        refreshDayData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

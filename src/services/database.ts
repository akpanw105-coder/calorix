import { supabase } from './supabase';
import { MealLogItem, ExerciseLogItem, UserProfile } from '@/types/calorix';

export interface DbProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height: number | null;
  weight: number | null;
  target_weight: number | null;
  activity_level: 'sedentary' | 'moderate' | 'very_active' | null;
  workout_frequency: number | null;
  goal: 'lose_fat' | 'maintain' | 'build_muscle' | null;
  daily_calorie_target: number | null;
  daily_water_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
  avatar_url: string | null;
  streak_days: number | null;
  is_pro: boolean | null;
  has_completed_onboarding: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface DbFoodLog {
  id: string;
  user_id: string;
  food_id: string | null;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  serving_size: string | null;
  image_url: string | null;
  logged_date: string;
  logged_at: string | null;
  created_at: string;
}

export interface DbWaterLog {
  id: string;
  user_id: string;
  logged_date: string;
  amount_ml: number;
  created_at: string;
}

export interface DbExerciseLog {
  id: string;
  user_id: string;
  exercise_name: string;
  category: string | null;
  duration_minutes: number;
  calories_burned: number;
  logged_date: string;
  logged_at: string | null;
  source: string | null;
  created_at: string;
}

export interface DbWeightLog {
  id: string;
  user_id: string;
  weight: number;
  logged_date: string;
  created_at: string;
}

export interface DbGoal {
  id: string;
  user_id: string;
  goal_type: 'lose_fat' | 'maintain' | 'build_muscle';
  target_weight: number | null;
  daily_calorie_target: number;
  daily_water_target: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  protocol_name: string | null;
  protocol_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------------
// PROFILE SERVICES
// -------------------------------------------------------------

export interface FetchedProfile {
  profile: UserProfile;
  hasCompletedOnboarding: boolean;
}

export async function fetchUserProfile(userId: string): Promise<FetchedProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile does not exist yet
        return null;
      }
      console.warn('[CALORIX Db] Warning fetching profile:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      profile: mapDbProfileToUser(data),
      hasCompletedOnboarding: Boolean(data.has_completed_onboarding),
    };
  } catch (err: any) {
    console.warn('[CALORIX Db] Exception fetching profile:', err?.message || err);
    return null;
  }
}

export async function upsertUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const payload: Partial<DbProfile> = {
    id: userId,
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) payload.full_name = updates.name;
  if (updates.username !== undefined) payload.username = updates.username;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.age !== undefined) payload.age = updates.age;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.heightCm !== undefined) payload.height = updates.heightCm;
  if (updates.currentWeightKg !== undefined) payload.weight = updates.currentWeightKg;
  if (updates.targetWeightKg !== undefined) payload.target_weight = updates.targetWeightKg;
  if (updates.activityLevel !== undefined) payload.activity_level = updates.activityLevel;
  if (updates.workoutFrequency !== undefined) payload.workout_frequency = updates.workoutFrequency;
  if (updates.goal !== undefined) payload.goal = updates.goal;
  if (updates.calorieTarget !== undefined) payload.daily_calorie_target = updates.calorieTarget;
  if (updates.waterGoalMl !== undefined) payload.daily_water_target = updates.waterGoalMl;
  if (updates.proteinTarget !== undefined) payload.protein_target = updates.proteinTarget;
  if (updates.carbsTarget !== undefined) payload.carbs_target = updates.carbsTarget;
  if (updates.fatTarget !== undefined) payload.fat_target = updates.fatTarget;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.streakDays !== undefined) payload.streak_days = updates.streakDays;
  if (updates.isPro !== undefined) payload.is_pro = updates.isPro;

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error('[CALORIX Db] Error upserting profile:', error.message);
    throw error;
  }

  return mapDbProfileToUser(data);
}

export function mapDbProfileToUser(db: DbProfile): UserProfile {
  return {
    name: db.full_name || 'Calorix User',
    username: db.username || 'calorix_user',
    email: db.email || '',
    age: db.age || 28,
    gender: db.gender || 'other',
    currentWeightKg: Number(db.weight) || 70,
    targetWeightKg: Number(db.target_weight) || 68,
    heightCm: Number(db.height) || 175,
    activityLevel: db.activity_level || 'moderate',
    workoutFrequency: db.workout_frequency || 3,
    goal: db.goal || 'lose_fat',
    calorieTarget: db.daily_calorie_target || 2000,
    proteinTarget: db.protein_target || 140,
    carbsTarget: db.carbs_target || 200,
    fatTarget: db.fat_target || 65,
    waterGoalMl: db.daily_water_target || 2500,
    streakDays: db.streak_days || 1,
    isPro: Boolean(db.is_pro),
    avatarUrl: db.avatar_url || '',
  };
}

// -------------------------------------------------------------
// FOOD LOGS SERVICES
// -------------------------------------------------------------

export async function fetchFoodLogsForDate(userId: string, date: string): Promise<MealLogItem[]> {
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_date', date)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[CALORIX Db] Error fetching food logs:', error.message);
    throw error;
  }

  return (data || []).map((row: DbFoodLog) => ({
    id: row.id,
    foodId: row.food_id || row.id,
    name: row.food_name,
    mealType: row.meal_type,
    calories: Number(row.calories) || 0,
    protein: Number(row.protein) || 0,
    carbs: Number(row.carbohydrates) || 0,
    fat: Number(row.fats) || 0,
    portion: row.serving_size || '1 serving',
    loggedAt: row.logged_at || '12:00',
    imageUrl: row.image_url || undefined,
  }));
}

export async function insertFoodLog(
  userId: string,
  date: string,
  item: Omit<MealLogItem, 'id'>
): Promise<MealLogItem> {
  const payload = {
    user_id: userId,
    food_id: item.foodId,
    food_name: item.name,
    meal_type: item.mealType,
    calories: item.calories,
    protein: item.protein,
    carbohydrates: item.carbs,
    fats: item.fat,
    serving_size: item.portion,
    image_url: item.imageUrl || null,
    logged_date: date,
    logged_at: item.loggedAt,
  };

  const { data, error } = await supabase
    .from('food_logs')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[CALORIX Db] Error inserting food log:', error.message);
    throw error;
  }

  return {
    id: data.id,
    foodId: data.food_id || data.id,
    name: data.food_name,
    mealType: data.meal_type,
    calories: Number(data.calories) || 0,
    protein: Number(data.protein) || 0,
    carbs: Number(data.carbohydrates) || 0,
    fat: Number(data.fats) || 0,
    portion: data.serving_size || '1 serving',
    loggedAt: data.logged_at || '12:00',
    imageUrl: data.image_url || undefined,
  };
}

export async function deleteFoodLog(id: string): Promise<void> {
  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[CALORIX Db] Error deleting food log:', error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// WATER LOGS SERVICES
// -------------------------------------------------------------

export async function fetchWaterLogsForDate(userId: string, date: string): Promise<number> {
  const { data, error } = await supabase
    .from('water_logs')
    .select('amount_ml')
    .eq('user_id', userId)
    .eq('logged_date', date);

  if (error) {
    console.error('[CALORIX Db] Error fetching water logs:', error.message);
    throw error;
  }

  return (data || []).reduce((sum, row) => sum + (Number(row.amount_ml) || 0), 0);
}

export async function insertWaterLog(userId: string, date: string, amountMl: number): Promise<void> {
  const { error } = await supabase
    .from('water_logs')
    .insert({
      user_id: userId,
      logged_date: date,
      amount_ml: amountMl,
    });

  if (error) {
    console.error('[CALORIX Db] Error inserting water log:', error.message);
    throw error;
  }
}

export async function resetOrSetWaterLogs(userId: string, date: string, targetTotalMl: number): Promise<void> {
  // Clear logs for the date then insert consolidated entry
  const { error: delError } = await supabase
    .from('water_logs')
    .delete()
    .eq('user_id', userId)
    .eq('logged_date', date);

  if (delError) {
    console.error('[CALORIX Db] Error clearing water logs:', delError.message);
    throw delError;
  }

  if (targetTotalMl > 0) {
    await insertWaterLog(userId, date, targetTotalMl);
  }
}

// -------------------------------------------------------------
// EXERCISE LOGS SERVICES
// -------------------------------------------------------------

export async function fetchExerciseLogsForDate(userId: string, date: string): Promise<ExerciseLogItem[]> {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_date', date)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[CALORIX Db] Error fetching exercise logs:', error.message);
    throw error;
  }

  return (data || []).map((row: DbExerciseLog) => ({
    id: row.id,
    title: row.exercise_name,
    category: row.category || 'General',
    durationMinutes: Number(row.duration_minutes) || 0,
    caloriesBurned: Number(row.calories_burned) || 0,
    loggedAt: row.logged_at || '12:00',
    source: row.source || 'Manual',
  }));
}

export async function insertExerciseLog(
  userId: string,
  date: string,
  exercise: Omit<ExerciseLogItem, 'id'>
): Promise<ExerciseLogItem> {
  const payload = {
    user_id: userId,
    exercise_name: exercise.title,
    category: exercise.category,
    duration_minutes: exercise.durationMinutes,
    calories_burned: exercise.caloriesBurned,
    logged_date: date,
    logged_at: exercise.loggedAt,
    source: exercise.source || 'Manual',
  };

  const { data, error } = await supabase
    .from('exercise_logs')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[CALORIX Db] Error inserting exercise log:', error.message);
    throw error;
  }

  return {
    id: data.id,
    title: data.exercise_name,
    category: data.category || 'General',
    durationMinutes: Number(data.duration_minutes) || 0,
    caloriesBurned: Number(data.calories_burned) || 0,
    loggedAt: data.logged_at || '12:00',
    source: data.source || 'Manual',
  };
}

export async function deleteExerciseLog(id: string): Promise<void> {
  const { error } = await supabase
    .from('exercise_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[CALORIX Db] Error deleting exercise log:', error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// WEIGHT LOGS SERVICES
// -------------------------------------------------------------

export async function recordWeightLog(userId: string, weightKg: number, date: string): Promise<void> {
  const { error } = await supabase
    .from('weight_logs')
    .upsert(
      {
        user_id: userId,
        weight: weightKg,
        logged_date: date,
      },
      {
        onConflict: 'user_id, logged_date',
      }
    );

  if (error) {
    console.error('[CALORIX Db] Error recording weight log:', error.message);
    throw error;
  }
}

export async function fetchWeightHistory(userId: string): Promise<{ date: string; weight: number }[]> {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('weight, logged_date')
    .eq('user_id', userId)
    .order('logged_date', { ascending: true });

  if (error) {
    console.error('[CALORIX Db] Error fetching weight history:', error.message);
    return [];
  }

  return (data || []).map(r => ({
    date: r.logged_date,
    weight: Number(r.weight),
  }));
}

// -------------------------------------------------------------
// RANGE TELEMETRY FOR PROGRESS / ANALYTICS
// -------------------------------------------------------------

export interface DayTelemetrySummary {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  targetCalories: number;
  waterIntakeMl: number;
  waterGoalMl: number;
  weightKg: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function fetchRangeTelemetry(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DayTelemetrySummary[]> {
  // Fetch food logs in date range
  const { data: foodData, error: _foodErr } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate);

  // Fetch exercise logs in date range
  const { data: exData, error: _exErr } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate);

  // Fetch water logs in date range
  const { data: waterData, error: _waterErr } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate);

  // Fetch weight logs in date range
  const { data: weightData, error: _weightErr } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate);

  // Collate per date
  const summaryMap: Record<string, DayTelemetrySummary> = {};

  (foodData || []).forEach(f => {
    const d = f.logged_date;
    if (!summaryMap[d]) {
      summaryMap[d] = {
        date: d,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        targetCalories: 2000,
        waterIntakeMl: 0,
        waterGoalMl: 2500,
        weightKg: 70,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }
    summaryMap[d].caloriesConsumed += Number(f.calories) || 0;
    summaryMap[d].protein += Number(f.protein) || 0;
    summaryMap[d].carbs += Number(f.carbohydrates) || 0;
    summaryMap[d].fat += Number(f.fats) || 0;
  });

  (exData || []).forEach(e => {
    const d = e.logged_date;
    if (!summaryMap[d]) {
      summaryMap[d] = {
        date: d,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        targetCalories: 2000,
        waterIntakeMl: 0,
        waterGoalMl: 2500,
        weightKg: 70,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }
    summaryMap[d].caloriesBurned += Number(e.calories_burned) || 0;
  });

  (waterData || []).forEach(w => {
    const d = w.logged_date;
    if (!summaryMap[d]) {
      summaryMap[d] = {
        date: d,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        targetCalories: 2000,
        waterIntakeMl: 0,
        waterGoalMl: 2500,
        weightKg: 70,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }
    summaryMap[d].waterIntakeMl += Number(w.amount_ml) || 0;
  });

  (weightData || []).forEach(w => {
    const d = w.logged_date;
    if (summaryMap[d]) {
      summaryMap[d].weightKg = Number(w.weight) || 70;
    }
  });

  return Object.values(summaryMap).sort((a, b) => a.date.localeCompare(b.date));
}

// -------------------------------------------------------------
// AVATAR / FILE STORAGE SERVICE
// -------------------------------------------------------------

export async function uploadAvatar(userId: string, fileBlob: Blob | ArrayBuffer, fileExt: string): Promise<string> {
  const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, fileBlob, {
      upsert: true,
      contentType: `image/${fileExt}`,
    });

  if (uploadError) {
    console.error('[CALORIX Storage] Upload error:', uploadError.message);
    throw uploadError;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

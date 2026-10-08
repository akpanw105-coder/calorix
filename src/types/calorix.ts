export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  portion: string;
  imageUrl?: string;
}

export interface MealLogItem {
  id: string;
  foodId: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  loggedAt: string;
  imageUrl?: string;
}

export interface ExerciseLogItem {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  loggedAt: string;
  source?: string;
}

export interface DailyData {
  date: string; // YYYY-MM-DD
  calorieTarget: number;
  waterIntakeMl: number;
  waterGoalMl: number;
  meals: MealLogItem[];
  exercises: ExerciseLogItem[];
  weightKg: number;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  currentWeightKg: number;
  targetWeightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'moderate' | 'very_active';
  workoutFrequency: number; // sessions per week
  goal: 'lose_fat' | 'maintain' | 'build_muscle';
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterGoalMl: number;
  streakDays: number;
  isPro: boolean;
  avatarUrl: string;
}

export interface AIPersonalizationResult {
  calorieTarget: number;
  waterTargetMl: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  bmr: number;
  tdee: number;
  protocolName: string;
  protocolDescription: string;
  recommendations: string[];
}

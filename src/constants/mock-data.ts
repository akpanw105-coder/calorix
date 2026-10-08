import { FoodItem, UserProfile, DailyData } from '@/types/calorix';

export const FOOD_CATEGORIES = [
  'All',
  'Breakfast',
  'Fruits',
  'Vegetables',
  'Protein',
  'Carbohydrates',
  'Grains',
  'Meat',
  'Seafood',
  'Drinks',
  'Snacks',
  'Desserts',
] as const;

export const INITIAL_FOOD_DATABASE: FoodItem[] = [
  {
    id: 'f1',
    name: 'Oatmeal with Blueberries & Whey',
    category: 'Breakfast',
    calories: 420,
    protein: 32,
    carbs: 54,
    fat: 8,
    portion: '1 bowl (300g)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDowwbZeqawhpma1RjYUu6ROoCRMhMuhOgfEwo8jrbVA8INqvnvXd82maWTS64KFPuXDRQOZ9PMQG5gfTWTq8TDUTVhyAszxcz__rIYEOy0H-ARHoAefCDM2XnjDpykiU0Jl-h_ROKbhNQeznBfalOaKfIw5jsxKuBfc0nLIi2i7ZUnliucvqx4cacMddagWjfWxKyi1dITLMyshZf_gSG-rkPbabDN2J3HErUPkTop',
  },
  {
    id: 'f2',
    name: 'Grilled Salmon Bowl & Quinoa',
    category: 'Seafood',
    calories: 500,
    protein: 42,
    carbs: 46,
    fat: 16,
    portion: '1 bowl (350g)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDirPKdVe80QlPCuhaU6B0lbe_WknyXLLNsFrR21PmjIVR0pFpxcYGmzfbNC6VzDjTXlelDXrYt0enXmHEmfsToGZtfTP994q2PVwkl6eMK5YpsLR-dPX-Co0kRpDIuTg0cmaP78CA1NA8fCZv3GhQ4FJrSmi2QZnmZO3Uwblmq2_lVEoD7Yz-lTtJ0AWWjajinlZ3XwphVvUzK5M7BAnuKhTQsqAGX5do2uIEr-cuW',
  },
  {
    id: 'f3',
    name: 'Roasted Almonds',
    category: 'Snacks',
    calories: 150,
    protein: 6,
    carbs: 5,
    fat: 13,
    portion: '25g (handful)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARPzBSf5E1xTlrx09_nACT6p_hNDNSSlxCXHWwHTVapJajkSIJHMztsHfluMIlf1Fg3yo3oVR4csqL9mP54grty3u97xIhsDGFDuW5C4FHrvb0i0AYxV0xk4Kq7fCFlDwLGKSOK-dCTIGOAu4OUwJ0lRCYkyZXRnVOuaSmPJErEo_GaFBk0dcKq-AYFrIc9kpuqMuCy8_PPmrRxtrTHNnWkgddCY8MFcpeS5f1jHWv',
  },
  {
    id: 'f4',
    name: 'Chicken Breast with Brown Rice & Broccoli',
    category: 'Meat',
    calories: 520,
    protein: 48,
    carbs: 52,
    fat: 9,
    portion: '1 plate (380g)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOo0KLJjk6zpyWvpnldvOK4k_bY2wxXxOr71J85zRjhsW8kx47ike85BG1HTizRc7VR0nUjsRvEF_8nyYTmLgSR_a4OQBUhO30-aTE0877XjtSOxPDbk_UInOleq4aadWK0tLPNft9WhOcULiiOlcnRXPLlbi6-Ks-UdGSr_dmt4VcxdcSY-YWScwtUfuRbelNuxyZ9FmFU42wvttVpUKiMxgRQPDKCABmmg59EhD8',
  },
  {
    id: 'f5',
    name: 'Greek Yogurt with Honey & Walnuts',
    category: 'Breakfast',
    calories: 240,
    protein: 20,
    carbs: 22,
    fat: 8,
    portion: '1 cup (200g)',
  },
  {
    id: 'f6',
    name: 'Fresh Avocado Toast with Poached Egg',
    category: 'Breakfast',
    calories: 340,
    protein: 14,
    carbs: 28,
    fat: 19,
    portion: '2 slices',
  },
  {
    id: 'f7',
    name: 'Black Coffee',
    category: 'Drinks',
    calories: 5,
    protein: 0.5,
    carbs: 0.8,
    fat: 0.1,
    portion: '1 mug (250ml)',
  },
  {
    id: 'f8',
    name: 'Whey Protein Isolate Shake',
    category: 'Protein',
    calories: 140,
    protein: 28,
    carbs: 2,
    fat: 1.5,
    portion: '1 scoop (35g)',
  },
  {
    id: 'f9',
    name: 'Ripe Banana',
    category: 'Fruits',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    portion: '1 medium fruit (118g)',
  },
  {
    id: 'f10',
    name: 'Steamed Sweet Potato',
    category: 'Carbohydrates',
    calories: 160,
    protein: 3,
    carbs: 37,
    fat: 0.2,
    portion: '1 medium (180g)',
  },
  {
    id: 'f11',
    name: 'Sirloin Steak with Asparagus',
    category: 'Meat',
    calories: 460,
    protein: 50,
    carbs: 4,
    fat: 26,
    portion: '200g steak',
  },
  {
    id: 'f12',
    name: 'Mixed Berry Smoothie',
    category: 'Drinks',
    calories: 210,
    protein: 6,
    carbs: 44,
    fat: 2,
    portion: '350ml',
  },
  {
    id: 'f13',
    name: 'Dark Chocolate (85%)',
    category: 'Desserts',
    calories: 170,
    protein: 3,
    carbs: 13,
    fat: 14,
    portion: '30g',
  },
  {
    id: 'f14',
    name: 'Tuna Salad with Olive Oil',
    category: 'Seafood',
    calories: 320,
    protein: 34,
    carbs: 6,
    fat: 17,
    portion: '200g',
  },
  {
    id: 'f15',
    name: 'Quinoa Bowl with Edamame & Tofu',
    category: 'Grains',
    calories: 380,
    protein: 22,
    carbs: 48,
    fat: 12,
    portion: '1 bowl (300g)',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Vance',
  username: 'alexvance',
  email: 'alex.vance@precision.health',
  age: 28,
  gender: 'male',
  currentWeightKg: 67.2,
  targetWeightKg: 63.0,
  heightCm: 178,
  activityLevel: 'moderate',
  workoutFrequency: 4,
  goal: 'lose_fat',
  calorieTarget: 1850,
  proteinTarget: 140,
  carbsTarget: 185,
  fatTarget: 62,
  waterGoalMl: 2800,
  streakDays: 7,
  isPro: true,
  avatarUrl: '',
};

// Generates helper date strings (YYYY-MM-DD)
export function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export function formatDisplayDate(dateStr: string): { label: string; subLabel: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = monthNames[targetDate.getMonth()];
  const dNum = targetDate.getDate();

  if (diffDays === 0) return { label: `Today, ${m} ${dNum}`, subLabel: 'Current day' };
  if (diffDays === -1) return { label: `Yesterday, ${m} ${dNum}`, subLabel: 'Previous day' };
  if (diffDays === 1) return { label: `Tomorrow, ${m} ${dNum}`, subLabel: 'Upcoming day' };

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return { label: `${weekdayNames[targetDate.getDay()]}, ${m} ${dNum}`, subLabel: dateStr };
}

// Initial days data populated with realistic records matching Stitch design
export const INITIAL_DAYS_DATA: Record<string, DailyData> = {
  [getDateOffset(0)]: {
    date: getDateOffset(0),
    calorieTarget: 1850,
    waterIntakeMl: 1750,
    waterGoalMl: 2800,
    weightKg: 67.2,
    meals: [
      {
        id: 'm1',
        foodId: 'f1',
        name: 'Oatmeal with Blueberries & Whey',
        mealType: 'breakfast',
        calories: 420,
        protein: 32,
        carbs: 54,
        fat: 8,
        portion: '1 bowl',
        loggedAt: '08:15',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDowwbZeqawhpma1RjYUu6ROoCRMhMuhOgfEwo8jrbVA8INqvnvXd82maWTS64KFPuXDRQOZ9PMQG5gfTWTq8TDUTVhyAszxcz__rIYEOy0H-ARHoAefCDM2XnjDpykiU0Jl-h_ROKbhNQeznBfalOaKfIw5jsxKuBfc0nLIi2i7ZUnliucvqx4cacMddagWjfWxKyi1dITLMyshZf_gSG-rkPbabDN2J3HErUPkTop',
      },
      {
        id: 'm2',
        foodId: 'f2',
        name: 'Grilled Salmon Bowl & Quinoa',
        mealType: 'lunch',
        calories: 500,
        protein: 42,
        carbs: 46,
        fat: 16,
        portion: '1 bowl',
        loggedAt: '13:00',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDirPKdVe80QlPCuhaU6B0lbe_WknyXLLNsFrR21PmjIVR0pFpxcYGmzfbNC6VzDjTXlelDXrYt0enXmHEmfsToGZtfTP994q2PVwkl6eMK5YpsLR-dPX-Co0kRpDIuTg0cmaP78CA1NA8fCZv3GhQ4FJrSmi2QZnmZO3Uwblmq2_lVEoD7Yz-lTtJ0AWWjajinlZ3XwphVvUzK5M7BAnuKhTQsqAGX5do2uIEr-cuW',
      },
      {
        id: 'm3',
        foodId: 'f3',
        name: 'Almonds (25g)',
        mealType: 'snacks',
        calories: 150,
        protein: 6,
        carbs: 5,
        fat: 13,
        portion: '25g',
        loggedAt: '16:30',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARPzBSf5E1xTlrx09_nACT6p_hNDNSSlxCXHWwHTVapJajkSIJHMztsHfluMIlf1Fg3yo3oVR4csqL9mP54grty3u97xIhsDGFDuW5C4FHrvb0i0AYxV0xk4Kq7fCFlDwLGKSOK-dCTIGOAu4OUwJ0lRCYkyZXRnVOuaSmPJErEo_GaFBk0dcKq-AYFrIc9kpuqMuCy8_PPmrRxtrTHNnWkgddCY8MFcpeS5f1jHWv',
      },
    ],
    exercises: [
      {
        id: 'e1',
        title: 'Morning 5k Run',
        category: 'Running',
        durationMinutes: 32,
        caloriesBurned: 310,
        loggedAt: '07:15',
        source: 'Apple Health',
      },
    ],
  },
  [getDateOffset(-1)]: {
    date: getDateOffset(-1),
    calorieTarget: 1850,
    waterIntakeMl: 2600,
    waterGoalMl: 2800,
    weightKg: 67.4,
    meals: [
      {
        id: 'm10',
        foodId: 'f1',
        name: 'Oatmeal & Berries',
        mealType: 'breakfast',
        calories: 390,
        protein: 26,
        carbs: 52,
        fat: 7,
        portion: '1 bowl',
        loggedAt: '08:30',
      },
      {
        id: 'm11',
        foodId: 'f4',
        name: 'Chicken Rice Bowl',
        mealType: 'lunch',
        calories: 520,
        protein: 48,
        carbs: 52,
        fat: 9,
        portion: '1 plate',
        loggedAt: '12:45',
      },
      {
        id: 'm12',
        foodId: 'f11',
        name: 'Steak & Greens',
        mealType: 'dinner',
        calories: 490,
        protein: 52,
        carbs: 8,
        fat: 28,
        portion: '1 plate',
        loggedAt: '19:30',
      },
      {
        id: 'm13',
        foodId: 'f8',
        name: 'Whey Protein Shake',
        mealType: 'snacks',
        calories: 140,
        protein: 28,
        carbs: 2,
        fat: 1.5,
        portion: '1 scoop',
        loggedAt: '21:00',
      },
    ],
    exercises: [
      {
        id: 'e2',
        title: 'Upper Body Strength Workout',
        category: 'Strength',
        durationMinutes: 55,
        caloriesBurned: 420,
        loggedAt: '18:00',
        source: 'Gym workout',
      },
    ],
  },
  [getDateOffset(1)]: {
    date: getDateOffset(1),
    calorieTarget: 1850,
    waterIntakeMl: 0,
    waterGoalMl: 2800,
    weightKg: 67.2,
    meals: [],
    exercises: [],
  },
};

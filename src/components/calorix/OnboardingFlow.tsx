import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { UserProfile, AIPersonalizationResult } from '@/types/calorix';
import { BrandLogo } from './BrandLogo';

interface OnboardingFlowProps {
  onComplete: (profile: Partial<UserProfile>, plan: AIPersonalizationResult) => Promise<void>;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [currentWeight, setCurrentWeight] = useState('68.5');
  const [targetWeight, setTargetWeight] = useState('63.0');
  const [heightCm, setHeightCm] = useState('178');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'very_active'>('moderate');
  const [goal, setGoal] = useState<'lose_fat' | 'maintain' | 'build_muscle'>('lose_fat');
  const [submitting, setSubmitting] = useState(false);

  // Compute Harris-Benedict BMR & TDEE
  const parsedWeight = parseFloat(currentWeight) || 70;
  const parsedHeight = parseFloat(heightCm) || 175;
  const parsedAge = parseInt(age) || 28;

  let bmr = Math.round(10 * parsedWeight + 6.25 * parsedHeight - 5 * parsedAge + (gender === 'male' ? 5 : -161));
  let activityMultiplier = 1.2;
  if (activityLevel === 'moderate') activityMultiplier = 1.55;
  if (activityLevel === 'very_active') activityMultiplier = 1.725;
  const tdee = Math.round(bmr * activityMultiplier);

  let targetCalories = tdee;
  if (goal === 'lose_fat') targetCalories = Math.max(1400, tdee - 500);
  if (goal === 'build_muscle') targetCalories = tdee + 350;

  const proteinGrams = Math.round(parsedWeight * 2.0); // 2g/kg
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbsGrams = Math.max(50, Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));
  const waterTargetMl = Math.round(parsedWeight * 35); // 35ml per kg

  const calculatedPlan: AIPersonalizationResult = {
    calorieTarget: targetCalories,
    waterTargetMl: Math.max(2000, waterTargetMl),
    proteinGrams,
    carbsGrams,
    fatGrams,
    bmr,
    tdee,
    protocolName:
      goal === 'lose_fat'
        ? 'Dynamic Lean Deficit'
        : goal === 'build_muscle'
        ? 'Hypertrophic Surplus'
        : 'Iso-Caloric Metabolic Maintenance',
    protocolDescription:
      'Calibrated automatically from continuous Harris-Benedict biometrics, TEF expenditure, and physical output envelope.',
    recommendations: [
      'Prioritize protein at first and last meals to maintain lean mass.',
      'Sustain daily hydration goal of at least 2.5L to boost metabolic rate.',
      'Distribute carbohydrate intake around peak training windows.',
    ],
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await onComplete(
        {
          age: parsedAge,
          gender,
          currentWeightKg: parsedWeight,
          targetWeightKg: parseFloat(targetWeight) || parsedWeight,
          heightCm: parsedHeight,
          activityLevel,
          workoutFrequency: activityLevel === 'sedentary' ? 1 : activityLevel === 'moderate' ? 4 : 6,
          goal,
          calorieTarget: targetCalories,
          proteinTarget: proteinGrams,
          carbsTarget: carbsGrams,
          fatTarget: fatGrams,
          waterGoalMl: Math.max(2000, waterTargetMl),
        },
        calculatedPlan
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step Indicator Header */}
        <View style={styles.header}>
          <BrandLogo variant="full" width={130} height={26} />
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP {step} OF 2</Text>
          </View>
        </View>

        {step === 1 ? (
          <>
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Customize Your Nutrition Target</Text>
              <Text style={styles.mainSubtitle}>
                CALORIX AI uses these precision telemetry metrics to compute your exact Basal Metabolic Rate (BMR) and daily caloric envelope.
              </Text>
            </View>

            {/* Age & Gender */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionEmoji}>👤</Text>
                <Text style={styles.sectionTitle}>Age & Identity</Text>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Age</Text>
                <View style={styles.stepperWrap}>
                  <Pressable
                    onPress={() => setAge(prev => Math.max(14, (parseInt(prev) || 28) - 1).toString())}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </Pressable>
                  <TextInput
                    style={styles.stepperInput}
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={setAge}
                  />
                  <Pressable
                    onPress={() => setAge(prev => Math.min(100, (parseInt(prev) || 28) + 1).toString())}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.genderRow}>
                {(['male', 'female', 'other'] as const).map(g => (
                  <Pressable
                    key={g}
                    onPress={() => setGender(g)}
                    style={[styles.genderPill, gender === g && styles.genderPillActive]}
                  >
                    <Text style={[styles.genderPillText, gender === g && styles.genderPillTextActive]}>
                      {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : '⚧ Other'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Body Composition */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionEmoji}>⚖️</Text>
                <Text style={styles.sectionTitle}>Body Composition (kg / cm)</Text>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Current Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="decimal-pad"
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  placeholder="e.g. 68.5"
                />
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Target Goal Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="decimal-pad"
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  placeholder="e.g. 63.0"
                />
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="number-pad"
                  value={heightCm}
                  onChangeText={setHeightCm}
                  placeholder="e.g. 178"
                />
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionEmoji}>⚡</Text>
                <Text style={styles.sectionTitle}>Activity Level</Text>
              </View>

              {[
                { key: 'sedentary', title: 'Sedentary', desc: 'Desk job, minimal baseline movement' },
                { key: 'moderate', title: 'Moderate Pace', desc: '3-4 workouts/week · 8,000 daily steps' },
                { key: 'very_active', title: 'Very Active', desc: '5-7 intense training sessions/week' },
              ].map(item => (
                <Pressable
                  key={item.key}
                  onPress={() => setActivityLevel(item.key as any)}
                  style={[styles.radioItem, activityLevel === item.key && styles.radioItemActive]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.radioTitle, activityLevel === item.key && styles.radioTitleActive]}>
                      {item.title}
                    </Text>
                    <Text style={styles.radioDesc}>{item.desc}</Text>
                  </View>
                  {activityLevel === item.key && <Text style={styles.checkIcon}>✓</Text>}
                </Pressable>
              ))}
            </View>

            {/* Primary Directive */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionEmoji}>🎯</Text>
                <Text style={styles.sectionTitle}>Primary Metabolism Directive</Text>
              </View>

              {[
                { key: 'lose_fat', title: 'Lose Fat & Lean Down', desc: 'Metabolic deficit tuned for tissue preservation' },
                { key: 'maintain', title: 'Maintain & Recomp', desc: 'Iso-caloric balance to optimize power-to-mass' },
                { key: 'build_muscle', title: 'Build Muscle Mass', desc: 'Hypertrophic surplus with elevated protein synthesis' },
              ].map(item => (
                <Pressable
                  key={item.key}
                  onPress={() => setGoal(item.key as any)}
                  style={[styles.radioItem, goal === item.key && styles.radioItemActive]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.radioTitle, goal === item.key && styles.radioTitleActive]}>
                      {item.title}
                    </Text>
                    <Text style={styles.radioDesc}>{item.desc}</Text>
                  </View>
                  {goal === item.key && <Text style={styles.checkIcon}>✓</Text>}
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => setStep(2)}
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.primaryBtnText}>Continue to AI Analysis →</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.titleSection}>
              <View style={styles.enginePill}>
                <Text style={styles.enginePillIcon}>✨</Text>
                <Text style={styles.enginePillText}>CALORIX INTELLIGENCE ENGINE V4.2</Text>
              </View>
              <Text style={styles.mainTitle}>Neural Plan Calibration</Text>
              <Text style={styles.mainSubtitle}>
                Your personalized metabolic blueprint is ready based on your biometrics and daily expenditure targets.
              </Text>
            </View>

            {/* Energy Blueprint Ring Card */}
            <View style={styles.planCard}>
              <View style={styles.planHeroRow}>
                <View style={styles.planTargetBox}>
                  <Text style={styles.planTargetLabel}>OPTIMAL INTAKE</Text>
                  <Text style={styles.planTargetKcal}>{calculatedPlan.calorieTarget.toLocaleString()} <Text style={styles.planTargetUnit}>kcal</Text></Text>
                  <Text style={styles.planTargetSub}>
                    {goal === 'lose_fat' ? '-500 kcal Deficit' : goal === 'build_muscle' ? '+350 kcal Surplus' : 'Iso-caloric Maintenance'}
                  </Text>
                </View>
              </View>

              <View style={styles.bmrRow}>
                <View style={styles.bmrCol}>
                  <Text style={styles.bmrLabel}>BMR Baseline</Text>
                  <Text style={styles.bmrVal}>{calculatedPlan.bmr} kcal</Text>
                </View>
                <View style={styles.bmrDivider} />
                <View style={styles.bmrCol}>
                  <Text style={styles.bmrLabel}>Total TDEE</Text>
                  <Text style={styles.bmrVal}>{calculatedPlan.tdee} kcal</Text>
                </View>
              </View>
            </View>

            {/* Target Breakdown Grid */}
            <View style={styles.sectionCard}>
              <Text style={styles.macroHeaderTitle}>Target Macro Partition</Text>
              <View style={styles.macroPillsRow}>
                <View style={[styles.macroPill, { borderColor: '#F43F5E' }]}>
                  <Text style={[styles.macroPillTag, { color: '#F43F5E' }]}>Protein</Text>
                  <Text style={styles.macroPillAmount}>{calculatedPlan.proteinGrams}g</Text>
                </View>

                <View style={[styles.macroPill, { borderColor: '#0EA5E9' }]}>
                  <Text style={[styles.macroPillTag, { color: '#0EA5E9' }]}>Carbs</Text>
                  <Text style={styles.macroPillAmount}>{calculatedPlan.carbsGrams}g</Text>
                </View>

                <View style={[styles.macroPill, { borderColor: '#8B5CF6' }]}>
                  <Text style={[styles.macroPillTag, { color: '#8B5CF6' }]}>Fats</Text>
                  <Text style={styles.macroPillAmount}>{calculatedPlan.fatGrams}g</Text>
                </View>
              </View>

              <View style={styles.hydrationRow}>
                <Text style={styles.hydrationEmoji}>💧</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hydrationTitle}>Hydration Target</Text>
                  <Text style={styles.hydrationVal}>{(calculatedPlan.waterTargetMl / 1000).toFixed(1)} L / day</Text>
                </View>
              </View>
            </View>

            <View style={styles.btnRow}>
              <Pressable
                onPress={() => setStep(1)}
                style={styles.backBtn}
              >
                <Text style={styles.backBtnText}>← Edit Biometrics</Text>
              </Pressable>

              <Pressable
                onPress={handleFinish}
                disabled={submitting}
                style={({ pressed }) => [styles.primaryBtn, { flex: 1 }, pressed && styles.btnPressed]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>Activate My Plan & Enter Dashboard →</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CalorixColors.background,
  },
  scrollContent: {
    padding: CalorixSpacing.md,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CalorixSpacing.md,
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: CalorixRadius.full,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: CalorixColors.primaryDark,
  },
  titleSection: {
    marginBottom: CalorixSpacing.md,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: CalorixColors.text,
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    fontSize: 13,
    color: CalorixColors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    marginBottom: CalorixSpacing.md,
    gap: CalorixSpacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionEmoji: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 13,
    color: CalorixColors.textSecondary,
    fontWeight: '500',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: CalorixRadius.md,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  stepperInput: {
    width: 50,
    height: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: CalorixRadius.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  genderPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  genderPillTextActive: {
    color: CalorixColors.primary,
    fontWeight: '700',
  },
  textInput: {
    height: 38,
    width: 120,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    borderRadius: CalorixRadius.md,
    paddingHorizontal: 10,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CalorixSpacing.sm,
    borderRadius: CalorixRadius.lg,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    backgroundColor: '#FAFAFA',
  },
  radioItemActive: {
    borderColor: CalorixColors.primary,
    backgroundColor: '#ECFDF5',
  },
  radioTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  radioTitleActive: {
    color: CalorixColors.primaryDark,
  },
  radioDesc: {
    fontSize: 11,
    color: CalorixColors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 16,
    color: CalorixColors.primary,
    fontWeight: '800',
  },
  primaryBtn: {
    height: 48,
    backgroundColor: CalorixColors.primary,
    borderRadius: CalorixRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: CalorixColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  enginePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: CalorixRadius.full,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  enginePillIcon: {
    fontSize: 11,
  },
  enginePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.primaryDark,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.lg,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    marginBottom: CalorixSpacing.md,
    alignItems: 'center',
  },
  planHeroRow: {
    alignItems: 'center',
    marginBottom: CalorixSpacing.md,
  },
  planTargetBox: {
    alignItems: 'center',
  },
  planTargetLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: CalorixColors.textSecondary,
    letterSpacing: 0.5,
  },
  planTargetKcal: {
    fontSize: 32,
    fontWeight: '800',
    color: CalorixColors.primary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  planTargetUnit: {
    fontSize: 16,
    color: CalorixColors.textSecondary,
    fontWeight: '600',
  },
  planTargetSub: {
    fontSize: 12,
    color: CalorixColors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  bmrRow: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: CalorixSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bmrCol: {
    alignItems: 'center',
  },
  bmrLabel: {
    fontSize: 11,
    color: CalorixColors.textTertiary,
  },
  bmrVal: {
    fontSize: 14,
    fontWeight: '700',
    color: CalorixColors.text,
    marginTop: 2,
  },
  bmrDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  macroHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  macroPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroPill: {
    flex: 1,
    padding: CalorixSpacing.sm,
    borderRadius: CalorixRadius.md,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    alignItems: 'center',
  },
  macroPillTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  macroPillAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: CalorixColors.text,
    marginTop: 2,
  },
  hydrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  hydrationEmoji: {
    fontSize: 18,
  },
  hydrationTitle: {
    fontSize: 12,
    color: CalorixColors.textSecondary,
  },
  hydrationVal: {
    fontSize: 14,
    fontWeight: '700',
    color: CalorixColors.secondary,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  backBtn: {
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CalorixRadius.lg,
    backgroundColor: '#F3F4F6',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
});

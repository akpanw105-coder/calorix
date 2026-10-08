import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
  ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface LogExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: {
    title: string;
    category: string;
    durationMinutes: number;
    caloriesBurned: number;
    loggedAt: string;
  }) => void;
}

const EXERCISE_PRESETS = [
  { title: 'Morning Run', category: 'Running', icon: '🏃', calPerMin: 9, defaultMin: 30 },
  { title: 'Cycling', category: 'Cycling', icon: '🚴', calPerMin: 8, defaultMin: 45 },
  { title: 'Strength Training', category: 'Strength', icon: '💪', calPerMin: 7, defaultMin: 50 },
  { title: 'HIIT Workout', category: 'HIIT', icon: '⚡', calPerMin: 11, defaultMin: 25 },
  { title: 'Swimming', category: 'Swimming', icon: '🏊', calPerMin: 10, defaultMin: 40 },
  { title: 'Yoga / Stretch', category: 'Yoga', icon: '🧘', calPerMin: 4, defaultMin: 60 },
  { title: 'Walking', category: 'Walking', icon: '🚶', calPerMin: 5, defaultMin: 40 },
  { title: 'Jump Rope', category: 'Cardio', icon: '🪢', calPerMin: 12, defaultMin: 20 },
];

export function LogExerciseModal({ visible, onClose, onAdd }: LogExerciseModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<typeof EXERCISE_PRESETS[number] | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [customCal, setCustomCal] = useState('');

  function calculateCalories(): number {
    const mins = parseInt(duration) || 30;
    if (customMode) return parseInt(customCal) || Math.round(mins * 8);
    if (!selectedPreset) return 0;
    return Math.round(mins * selectedPreset.calPerMin);
  }

  function handleSave() {
    if (!selectedPreset && !customMode) return;
    const cal = calculateCalories();
    onAdd({
      title: customMode ? customTitle || 'Custom Exercise' : selectedPreset!.title,
      category: customMode ? 'Custom' : selectedPreset!.category,
      durationMinutes: parseInt(duration) || 30,
      caloriesBurned: cal,
      loggedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    setSelectedPreset(null);
    setCustomMode(false);
    setCustomTitle('');
    setDuration('30');
    setCustomCal('');
    onClose();
  }

  const calories = calculateCalories();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Exercise</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Select Activity</Text>

            <View style={styles.presetGrid}>
              {EXERCISE_PRESETS.map(preset => (
                <Pressable
                  key={preset.title}
                  onPress={() => { setSelectedPreset(preset); setCustomMode(false); }}
                  style={[styles.presetCard, selectedPreset?.title === preset.title && styles.presetCardActive]}
                >
                  <Text style={styles.presetIcon}>{preset.icon}</Text>
                  <Text style={[styles.presetName, selectedPreset?.title === preset.title && styles.presetNameActive]}>
                    {preset.title}
                  </Text>
                  <Text style={styles.presetCal}>{preset.calPerMin} cal/min</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => { setCustomMode(true); setSelectedPreset(null); }}
                style={[styles.presetCard, customMode && styles.presetCardActive]}
              >
                <Text style={styles.presetIcon}>✏️</Text>
                <Text style={[styles.presetName, customMode && styles.presetNameActive]}>Custom</Text>
                <Text style={styles.presetCal}>Enter details</Text>
              </Pressable>
            </View>

            {customMode && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Exercise Name</Text>
                <TextInput
                  style={styles.input}
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="e.g., Rock Climbing"
                  placeholderTextColor={CalorixColors.textMuted}
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Duration (minutes)</Text>
              <View style={styles.durationRow}>
                {[15, 20, 30, 45, 60].map(d => (
                  <Pressable
                    key={d}
                    onPress={() => setDuration(d.toString())}
                    style={[styles.durationChip, duration === d.toString() && styles.durationChipActive]}
                  >
                    <Text style={[styles.durationChipText, duration === d.toString() && styles.durationChipTextActive]}>
                      {d}m
                    </Text>
                  </Pressable>
                ))}
                <TextInput
                  style={styles.durationInput}
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholder="custom"
                  placeholderTextColor={CalorixColors.textMuted}
                />
              </View>
            </View>

            {customMode && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Calories Burned (optional)</Text>
                <TextInput
                  style={styles.input}
                  value={customCal}
                  onChangeText={setCustomCal}
                  keyboardType="numeric"
                  placeholder={`~${Math.round((parseInt(duration) || 30) * 8)} estimated`}
                  placeholderTextColor={CalorixColors.textMuted}
                />
              </View>
            )}

            {(selectedPreset || customMode) && (
              <View style={styles.preview}>
                <Text style={styles.previewLabel}>Estimated Calories Burned</Text>
                <Text style={styles.previewCalories}>{calories} kcal</Text>
                <Text style={styles.previewDuration}>{duration} minutes</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={handleSave}
              disabled={!selectedPreset && !customMode}
              style={({ pressed }) => [
                styles.saveBtn,
                (!selectedPreset && !customMode) && styles.saveBtnDisabled,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.saveBtnText}>Log Exercise</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CalorixColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CalorixSpacing.md,
    paddingTop: CalorixSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: CalorixColors.cardBorder,
  },
  title: { fontSize: 20, fontWeight: '700', color: CalorixColors.text },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, color: CalorixColors.textSecondary, fontWeight: '600' },
  content: { padding: CalorixSpacing.md, gap: CalorixSpacing.md, paddingBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: CalorixColors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  presetCard: {
    width: '47%',
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    alignItems: 'center',
    gap: 4,
  },
  presetCardActive: {
    backgroundColor: CalorixColors.primaryLight,
    borderColor: CalorixColors.primary,
  },
  presetIcon: { fontSize: 28 },
  presetName: { fontSize: 13, fontWeight: '600', color: CalorixColors.text, textAlign: 'center' },
  presetNameActive: { color: CalorixColors.primaryHover },
  presetCal: { fontSize: 10, color: CalorixColors.textMuted },
  field: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: CalorixColors.textSecondary },
  input: {
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    paddingHorizontal: CalorixSpacing.md,
    height: 48,
    fontSize: 15,
    color: CalorixColors.text,
  },
  durationRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  durationChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: CalorixRadius.full,
    backgroundColor: '#F3F4F6',
  },
  durationChipActive: { backgroundColor: CalorixColors.primary },
  durationChipText: { fontSize: 12, fontWeight: '600', color: CalorixColors.textSecondary },
  durationChipTextActive: { color: '#fff' },
  durationInput: {
    flex: 1,
    height: 40,
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 13,
    color: CalorixColors.text,
  },
  preview: {
    backgroundColor: CalorixColors.primaryLight,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: CalorixColors.primaryBorder,
  },
  previewLabel: { fontSize: 11, color: CalorixColors.primaryHover, textTransform: 'uppercase', fontWeight: '600' },
  previewCalories: { fontSize: 32, fontWeight: '700', color: CalorixColors.text },
  previewDuration: { fontSize: 13, color: CalorixColors.textMuted },
  footer: { padding: CalorixSpacing.md, borderTopWidth: 1, borderTopColor: CalorixColors.cardBorder },
  saveBtn: {
    backgroundColor: CalorixColors.primary,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

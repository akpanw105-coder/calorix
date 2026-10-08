import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
  ScrollView, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface AddWaterModalProps {
  visible: boolean;
  currentIntakeMl: number;
  goalMl: number;
  onClose: () => void;
  onAdd: (amount: number) => void;
}

const QUICK_AMOUNTS = [150, 250, 330, 500, 750];

export function AddWaterModal({ visible, currentIntakeMl, goalMl, onClose, onAdd }: AddWaterModalProps) {
  const [customAmount, setCustomAmount] = useState('');

  function handleQuickAdd(amount: number) {
    onAdd(amount);
    onClose();
  }

  function handleCustomAdd() {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      onAdd(amount);
      setCustomAmount('');
      onClose();
    }
  }

  const pct = Math.min(1, currentIntakeMl / goalMl);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>💧 Add Water</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Current intake summary */}
          <View style={styles.summary}>
            <View style={styles.summaryNums}>
              <Text style={styles.current}>{(currentIntakeMl / 1000).toFixed(2)} L</Text>
              <Text style={styles.goal}> / {(goalMl / 1000).toFixed(1)} L goal</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` as any }]} />
            </View>
            <Text style={styles.progressPct}>{Math.round(pct * 100)}% of daily goal</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionLabel}>Quick Add</Text>
            <View style={styles.quickGrid}>
              {QUICK_AMOUNTS.map(amount => (
                <Pressable
                  key={amount}
                  onPress={() => handleQuickAdd(amount)}
                  style={({ pressed }) => [styles.quickBtn, pressed && styles.quickBtnPressed]}
                >
                  <Text style={styles.quickBtnAmount}>{amount}</Text>
                  <Text style={styles.quickBtnUnit}>ml</Text>
                  <Text style={styles.quickBtnIcon}>
                    {amount <= 250 ? '🥛' : amount <= 500 ? '💧' : '🪣'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Custom Amount</Text>
            <View style={styles.customRow}>
              <TextInput
                style={styles.customInput}
                value={customAmount}
                onChangeText={setCustomAmount}
                placeholder="Enter ml..."
                placeholderTextColor={CalorixColors.textMuted}
                keyboardType="numeric"
              />
              <Text style={styles.mlLabel}>ml</Text>
              <Pressable
                onPress={handleCustomAdd}
                disabled={!customAmount || parseInt(customAmount) <= 0}
                style={({ pressed }) => [
                  styles.customAddBtn,
                  (!customAmount || parseInt(customAmount) <= 0) && styles.customAddBtnDisabled,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.customAddBtnText}>Add</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CalorixColors.background },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CalorixSpacing.md,
    paddingBottom: CalorixSpacing.md,
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
  summary: {
    margin: CalorixSpacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  summaryNums: { flexDirection: 'row', alignItems: 'baseline' },
  current: { fontSize: 28, fontWeight: '700', color: '#1D4ED8' },
  goal: { fontSize: 16, color: CalorixColors.textMuted },
  progressTrack: {
    height: 10,
    backgroundColor: '#DBEAFE',
    borderRadius: CalorixRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: CalorixRadius.full,
  },
  progressPct: { fontSize: 12, color: '#1D4ED8', fontWeight: '500', textAlign: 'right' },
  content: { padding: CalorixSpacing.md, gap: CalorixSpacing.md },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: CalorixColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickBtn: {
    width: '30%',
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
  },
  quickBtnPressed: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  quickBtnAmount: { fontSize: 20, fontWeight: '700', color: CalorixColors.text },
  quickBtnUnit: { fontSize: 11, color: CalorixColors.textMuted },
  quickBtnIcon: { fontSize: 20 },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    flex: 1,
    height: 48,
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    paddingHorizontal: CalorixSpacing.md,
    fontSize: 16,
    color: CalorixColors.text,
  },
  mlLabel: { fontSize: 14, color: CalorixColors.textMuted, fontWeight: '500' },
  customAddBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: CalorixRadius.xl,
  },
  customAddBtnDisabled: { opacity: 0.4 },
  customAddBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

import React from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
} from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface GlobalAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction: (action: 'food' | 'scan' | 'exercise' | 'water') => void;
}

export function GlobalAddModal({ visible, onClose, onSelectAction }: GlobalAddModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.title}>Quick Log & Capture</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.optionsList}>
            {/* 1. Log Food */}
            <Pressable
              onPress={() => onSelectAction('food')}
              style={({ pressed }) => [styles.optionCard, pressed && styles.optionPressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                <Text style={styles.optionIcon}>🍽️</Text>
              </View>
              <View style={styles.optionContent}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>Log Food</Text>
                  <View style={styles.badgePrimary}>
                    <Text style={styles.badgePrimaryText}>2M+ DB</Text>
                  </View>
                </View>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  Search our verified database of 2M+ whole foods and meals
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            {/* 2. Scan Food / Barcode */}
            <Pressable
              onPress={() => onSelectAction('scan')}
              style={({ pressed }) => [styles.optionCard, pressed && styles.optionPressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                <Text style={styles.optionIcon}>📸</Text>
              </View>
              <View style={styles.optionContent}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>Scan Food / Barcode</Text>
                  <View style={styles.badgeTeal}>
                    <Text style={styles.badgeTealText}>AI Vision</Text>
                  </View>
                </View>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  Point camera at food or plate for instant AI nutrient breakdown
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            {/* 3. Log Exercise */}
            <Pressable
              onPress={() => onSelectAction('exercise')}
              style={({ pressed }) => [styles.optionCard, pressed && styles.optionPressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                <Text style={styles.optionIcon}>💪</Text>
              </View>
              <View style={styles.optionContent}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>Log Exercise</Text>
                  <View style={styles.badgeGray}>
                    <Text style={styles.badgeGrayText}>Auto-sync</Text>
                  </View>
                </View>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  Record workouts, cardio, strength, or sync fitness tracker
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>

            {/* 4. Add Water */}
            <Pressable
              onPress={() => onSelectAction('water')}
              style={({ pressed }) => [styles.optionCard, pressed && styles.optionPressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                <Text style={styles.optionIcon}>💧</Text>
              </View>
              <View style={styles.optionContent}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>Add Water</Text>
                  <View style={styles.badgeBlue}>
                    <Text style={styles.badgeBlueText}>+250ml</Text>
                  </View>
                </View>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  Log water intake in glasses, bottles, or custom volume
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: CalorixColors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: CalorixSpacing.md,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: CalorixSpacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: CalorixSpacing.xs,
    marginBottom: CalorixSpacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: CalorixColors.primary,
  },
  title: {
    fontSize: 18,
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
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CalorixSpacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: CalorixRadius.xl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: CalorixSpacing.md,
  },
  optionPressed: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    transform: [{ scale: 0.99 }],
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: CalorixRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 22,
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  optionSubtitle: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
  chevron: {
    fontSize: 22,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  badgePrimary: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  badgePrimaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  badgeTeal: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  badgeTealText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  badgeGray: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  badgeGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  badgeBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  badgeBlueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/services/AuthContext';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { Toast } from '@/components/calorix/Toast';
import { BrandLogo } from '@/components/calorix/BrandLogo';

export default function ProfileScreen() {
  const { profile, updateProfile, setCalorieTarget, toast, clearToast, showToast } = useApp();
  const { signOut } = useAuth();

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [recalibrateVisible, setRecalibrateVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // Form states
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [calorieTarget, setLocalCalorieTarget] = useState(profile.calorieTarget.toString());
  const [currentWeight, setCurrentWeight] = useState(profile.currentWeightKg.toString());
  const [targetWeight, setTargetWeight] = useState(profile.targetWeightKg.toString());

  // Save profile edits
  const handleSaveProfile = async () => {
    await updateProfile({
      name,
      username,
    });
    setEditProfileVisible(false);
    showToast('Profile updated', 'success');
  };

  // Recalibrate AI plan simulation
  const handleRecalibrate = async () => {
    const newTarget = 1890;
    await setCalorieTarget(newTarget);
    setRecalibrateVisible(false);
    showToast('Plan recalibrated to 1,890 kcal by AI Engine', 'success');
  };

  // Update weight
  const handleSaveWeight = async () => {
    const w = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    if (!isNaN(w)) {
      await updateProfile({ currentWeightKg: w, targetWeightKg: isNaN(tw) ? profile.targetWeightKg : tw });
      setWeightModalVisible(false);
      showToast('Weight log updated', 'success');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={clearToast}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerBrand}>Profile & Settings</Text>
        </View>
        <Pressable
          onPress={() => setEditProfileVisible(true)}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile & Hero Identity Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroProfileRow}>
            <View style={styles.avatarWrap}>
              {profile.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarInitials]}>
                  <Text style={styles.avatarInitialsText}>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.heroMeta}>
              <View style={styles.heroNameRow}>
                <Text style={styles.heroName} numberOfLines={1}>{profile.name || 'User Profile'}</Text>
              </View>
              {profile.username ? (
                <Text style={styles.handleText}>@{profile.username}</Text>
              ) : null}
              {profile.email ? (
                <Text style={styles.emailText}>{profile.email}</Text>
              ) : null}
            </View>
          </View>

          {/* Telemetry Summary Bar */}
          <View style={styles.triptychGrid}>
            <View style={styles.triptychCol}>
              <Text style={[styles.triptychVal, { color: CalorixColors.primary }]}>{profile.streakDays || 1}</Text>
              <Text style={styles.triptychLabel}>Day Streak</Text>
            </View>
            <View style={[styles.triptychCol, styles.triptychColActive]}>
              <Text style={[styles.triptychVal, { color: CalorixColors.text }]}>{profile.currentWeightKg}<Text style={styles.unitSmall}> kg</Text></Text>
              <Text style={styles.triptychLabel}>Current Weight</Text>
            </View>
            <View style={styles.triptychCol}>
              <Text style={[styles.triptychVal, { color: '#0284C7' }]}>{profile.workoutFrequency || 3}</Text>
              <Text style={styles.triptychLabel}>Workouts / wk</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Plan Targets */}
        <View style={styles.card}>
          <View style={styles.planHeader}>
            <Text style={styles.planSectionTitle}>Daily Nutrition Targets</Text>
          </View>

          {/* Macro Readout Targets */}
          <View style={styles.macroBox}>
            <View style={styles.macroBudgetRow}>
              <Text style={styles.budgetTitle}>Calorie Target</Text>
              <Text style={styles.budgetKcal}>
                {profile.calorieTarget.toLocaleString()}{' '}
                <Text style={styles.budgetKcalUnit}>kcal</Text>
              </Text>
            </View>

            {/* Segmented bar */}
            <View style={styles.segmentedTrack}>
              <View style={[styles.segment, { width: '32%', backgroundColor: '#F43F5E' }]} />
              <View style={[styles.segment, { width: '42%', backgroundColor: '#0EA5E9' }]} />
              <View style={[styles.segment, { width: '26%', backgroundColor: '#8B5CF6' }]} />
            </View>

            {/* Target Breakdown Grid */}
            <View style={styles.macroGrid}>
              <View style={styles.macroCol}>
                <View style={styles.macroTagRow}>
                  <View style={[styles.dot, { backgroundColor: '#F43F5E' }]} />
                  <Text style={styles.macroTag}>Protein</Text>
                </View>
                <Text style={styles.macroAmount}>{profile.proteinTarget}g</Text>
              </View>

              <View style={styles.macroCol}>
                <View style={styles.macroTagRow}>
                  <View style={[styles.dot, { backgroundColor: '#0EA5E9' }]} />
                  <Text style={styles.macroTag}>Carbs</Text>
                </View>
                <Text style={styles.macroAmount}>{profile.carbsTarget}g</Text>
              </View>

              <View style={styles.macroCol}>
                <View style={styles.macroTagRow}>
                  <View style={[styles.dot, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.macroTag}>Fat</Text>
                </View>
                <Text style={styles.macroAmount}>{profile.fatTarget}g</Text>
              </View>
            </View>
          </View>

          {/* Recalibrate Plan button */}
          <Pressable
            onPress={() => setRecalibrateVisible(true)}
            style={({ pressed }) => [styles.recalibrateBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.recalibrateText}>Recalibrate Plan Targets</Text>
            <Text style={styles.chevronRight}>›</Text>
          </Pressable>
        </View>

        {/* Health & Biometrics Group */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>HEALTH & BIOMETRICS</Text>
          </View>

          <View style={styles.menuCard}>
            {/* Weight Target */}
            <Pressable
              onPress={() => setWeightModalVisible(true)}
              style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
            >
              <View style={styles.menuLeft}>
                <View>
                  <Text style={styles.menuTitle}>Body Weight</Text>
                  <Text style={styles.menuSub}>
                    Current: {profile.currentWeightKg} kg · Target: {profile.targetWeightKg} kg
                  </Text>
                </View>
              </View>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>

            {/* Height & BMI */}
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View>
                  <Text style={styles.menuTitle}>Height</Text>
                  <Text style={styles.menuSub}>{profile.heightCm} cm</Text>
                </View>
              </View>
            </View>

            {/* Daily Calorie Goal */}
            <Pressable
              onPress={() => setRecalibrateVisible(true)}
              style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
            >
              <View style={styles.menuLeft}>
                <View>
                  <Text style={styles.menuTitle}>Daily Target Budget</Text>
                  <Text style={styles.menuSub}>
                    {profile.calorieTarget} kcal / day
                  </Text>
                </View>
              </View>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Account & App Settings */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View>
                  <Text style={styles.menuTitle}>Push Notifications</Text>
                  <Text style={styles.menuSub}>Meal reminders & hydration alerts</Text>
                </View>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Enabled</Text>
              </View>
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View>
                  <Text style={styles.menuTitle}>Health Sync</Text>
                  <Text style={styles.menuSub}>Automatic workout & step intake</Text>
                </View>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Connected</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sign Out Section */}
        <View style={styles.signOutWrap}>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [styles.signOutBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
          <View style={styles.versionWrap}>
            <BrandLogo variant="symbol" width={24} height={24} />
            <Text style={styles.versionLabel}>CALORIX v2.4.0</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditProfileVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Pressable onPress={() => setEditProfileVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={setUsername}
              placeholder="@handle"
              autoCapitalize="none"
            />
            <Pressable onPress={handleSaveProfile} style={styles.modalSaveBtn}>
              <Text style={styles.modalSaveText}>Save Changes</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Recalibrate AI Modal */}
      <Modal visible={recalibrateVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setRecalibrateVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Plan Recalibration</Text>
            <Pressable onPress={() => setRecalibrateVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.recalBox}>
              <Text style={styles.recalTitle}>✨ Recommended Adjustment</Text>
              <Text style={styles.recalBody}>
                Based on your last 7 days of 310 kcal daily workouts and 96% adherence, your daily metabolic target has been optimized from {profile.calorieTarget} kcal to 1,890 kcal.
              </Text>
            </View>
            <Pressable onPress={handleRecalibrate} style={styles.modalSaveBtn}>
              <Text style={styles.modalSaveText}>Apply Recommended Plan</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Body Weight Modal */}
      <Modal visible={weightModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setWeightModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Body Mass</Text>
            <Pressable onPress={() => setWeightModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Current Weight (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              keyboardType="decimal-pad"
            />
            <Text style={styles.inputLabel}>Target Weight (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="decimal-pad"
            />
            <Pressable onPress={handleSaveWeight} style={styles.modalSaveBtn}>
              <Text style={styles.modalSaveText}>Save Weight</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '800',
    color: CalorixColors.text,
    letterSpacing: -0.5,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  btnPressed: {
    opacity: 0.75,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CalorixSpacing.md,
    gap: CalorixSpacing.md,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    position: 'relative',
    overflow: 'hidden',
    gap: CalorixSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  heroProfileRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#ECFDF5',
  },
  avatarInitials: {
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 26,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  heroMeta: {
    flex: 1,
    gap: 2,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: CalorixColors.text,
  },
  pencilCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pencilIcon: {
    fontSize: 14,
    color: CalorixColors.textSecondary,
  },
  handleText: {
    fontSize: 13,
    color: CalorixColors.textSecondary,
    fontWeight: '500',
  },
  emailText: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
  triptychGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: CalorixRadius.lg,
    padding: 8,
    gap: 4,
  },
  triptychCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  triptychColActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: CalorixRadius.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  triptychVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  unitSmall: {
    fontSize: 11,
    fontWeight: '400',
  },
  triptychLabel: {
    fontSize: 10,
    color: CalorixColors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    gap: CalorixSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  aiPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: CalorixRadius.full,
  },
  engineBadgeIcon: {
    fontSize: 12,
  },
  engineBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  versionPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  versionText: {
    fontSize: 10,
    color: CalorixColors.textMuted,
  },
  planInfo: {
    gap: 2,
  },
  planTag: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.textMuted,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  planDesc: {
    fontSize: 12,
    color: CalorixColors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  macroBox: {
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: CalorixRadius.lg,
    padding: 12,
    gap: 10,
  },
  macroBudgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  budgetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  budgetKcal: {
    fontSize: 20,
    fontWeight: '800',
    color: CalorixColors.primary,
  },
  budgetKcalUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: CalorixColors.textMuted,
  },
  segmentedTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
  },
  segment: {
    height: '100%',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  macroCol: {
    alignItems: 'center',
    gap: 2,
  },
  macroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroTag: {
    fontSize: 10,
    color: CalorixColors.textMuted,
    fontWeight: '600',
  },
  macroAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  macroPct: {
    fontSize: 10,
    fontWeight: '400',
    color: CalorixColors.textMuted,
  },
  recalibrateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: CalorixRadius.lg,
  },
  recalibrateIcon: {
    fontSize: 18,
  },
  recalibrateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  chevronRight: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  sectionWrap: {
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.textMuted,
    letterSpacing: 0.5,
  },
  smartScale: {
    fontSize: 11,
    color: CalorixColors.primary,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: CalorixRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CalorixSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemPressed: {
    backgroundColor: '#F9FAFB',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: CalorixRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CalorixColors.text,
  },
  menuSub: {
    fontSize: 12,
    color: CalorixColors.textMuted,
    marginTop: 1,
  },
  menuChevron: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  bmiPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: CalorixRadius.full,
  },
  bmiText: {
    fontSize: 11,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  activePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: CalorixRadius.full,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: CalorixSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: CalorixColors.textSecondary,
  },
  modalBody: {
    padding: CalorixSpacing.md,
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: CalorixRadius.lg,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: CalorixColors.text,
  },
  modalSaveBtn: {
    backgroundColor: CalorixColors.primary,
    borderRadius: CalorixRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recalBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: CalorixRadius.lg,
    padding: CalorixSpacing.md,
    gap: 6,
  },
  recalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
  },
  recalBody: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
  },
  signOutWrap: {
    marginTop: CalorixSpacing.lg,
    alignItems: 'center',
    gap: 12,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: CalorixRadius.lg,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  signOutIcon: {
    fontSize: 18,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E11D48',
  },
  versionWrap: {
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  versionLabel: {
    fontSize: 11,
    color: CalorixColors.textTertiary,
    fontWeight: '600',
  },
  versionSub: {
    fontSize: 10,
    color: CalorixColors.textMuted,
  },
});

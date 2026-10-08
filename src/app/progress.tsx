import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Svg, Line, Rect, Circle, Polygon, Polyline, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useApp } from '@/context/AppContext';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';
import { Toast } from '@/components/calorix/Toast';
import { getDateOffset } from '@/constants/mock-data';

type Period = 'Day' | 'Week' | 'Month' | 'Year';

export default function ProgressScreen() {
  const { profile, getRangeData, toast, clearToast, showToast } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Week');
  const [realAdherence, setRealAdherence] = useState<{ day: string; value: number; target: number; isSurplus: boolean }[] | null>(null);

  // Fetch real analytics records from Supabase
  useEffect(() => {
    let active = true;

    async function loadTelemetry() {
      try {
        const daysBack = selectedPeriod === 'Day' ? 1 : selectedPeriod === 'Week' ? 7 : selectedPeriod === 'Month' ? 30 : 365;
        const startDate = getDateOffset(-daysBack);
        const endDate = getDateOffset(0);

        const summary = await getRangeData(startDate, endDate);
        if (!active) return;

        if (summary && summary.length > 0) {
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const mapped = summary.slice(-7).map(item => {
            const dateObj = new Date(item.date + 'T12:00:00');
            const dayName = daysOfWeek[dateObj.getDay()];
            const val = item.caloriesConsumed;
            const tgt = item.targetCalories || profile.calorieTarget;
            return {
              day: dayName,
              value: val,
              target: tgt,
              isSurplus: val > tgt,
            };
          });
          setRealAdherence(mapped);
        }
      } catch (err) {
        console.warn('[CALORIX Analytics] Error loading telemetry:', err);
      }
    }

    loadTelemetry();

    return () => {
      active = false;
    };
  }, [selectedPeriod, getRangeData, profile.calorieTarget]);

  // Fallback baseline adherence data
  const defaultAdherence = [
    { day: 'Mon', value: 1820, target: 1850, isSurplus: false },
    { day: 'Tue', value: 1890, target: 1850, isSurplus: true },
    { day: 'Wed', value: 1760, target: 1850, isSurplus: false },
    { day: 'Thu', value: 1840, target: 1850, isSurplus: false },
    { day: 'Fri', value: 1910, target: 1850, isSurplus: true },
    { day: 'Sat', value: 1710, target: 1850, isSurplus: false },
    { day: 'Sun', value: 1740, target: 1850, isSurplus: false },
  ];

  const adherenceData = realAdherence && realAdherence.length > 0 ? realAdherence : defaultAdherence;

  const avgKcal = Math.round(adherenceData.reduce((acc, curr) => acc + curr.value, 0) / adherenceData.length);
  const underCount = adherenceData.filter(d => !d.isSurplus).length;
  const overCount = adherenceData.filter(d => d.isSurplus).length;

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
          <Text style={styles.headerBrand}>Analytics & Progress</Text>
        </View>
        <Pressable
          onPress={() => showToast('Exporting health report...', 'info')}
          style={styles.exportBtn}
        >
          <Text style={styles.exportIcon}>📊</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Navigation Bar */}
        <View style={styles.periodBar}>
          {(['Day', 'Week', 'Month', 'Year'] as Period[]).map((period) => (
            <Pressable
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodBtn,
                selectedPeriod === period && styles.periodBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  selectedPeriod === period && styles.periodBtnTextActive,
                ]}
              >
                {period}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Milestone Streak Card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneContent}>
            <View style={styles.milestoneInfo}>
              <Text style={styles.milestoneTitle}>7-Day Logging Streak</Text>
              <Text style={styles.milestoneSub}>
                Consistent tracking achieved. You've logged all meals this week with zero missed days.
              </Text>
            </View>
          </View>
        </View>

        {/* Caloric Adherence Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.cardHeaderTag}>
                <Text style={styles.tagText}>CALORIE ADHERENCE</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricVal}>{avgKcal.toLocaleString()}</Text>
                <Text style={styles.metricUnit}>kcal / day avg</Text>
              </View>
            </View>
            <View style={styles.goalPill}>
              <Text style={styles.goalPillText}>✓ 96% Goal Met</Text>
            </View>
          </View>

          {/* Target Indicator */}
          <View style={styles.targetRow}>
            <View style={styles.targetLeft}>
              <View style={styles.dashIndicator} />
              <Text style={styles.targetLabel}>Baseline Target: 1,850 kcal</Text>
            </View>
            <Text style={styles.targetDelta}>-40 kcal net delta</Text>
          </View>

          {/* Interactive Adherence Bar Chart */}
          <View style={styles.chartContainer}>
            <Svg width="100%" height={140} viewBox="0 0 320 140">
              {/* Baseline target dashed line */}
              <Line
                x1="0"
                y1="46"
                x2="320"
                y2="46"
                stroke="#E5E7EB"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />

              {/* Day Bars */}
              {adherenceData.map((d, index) => {
                const x = 8 + index * 46;
                const height = Math.min(110, (d.value / 2200) * 110);
                const y = 140 - height;
                const barColor = d.isSurplus ? '#F87171' : CalorixColors.primary;

                return (
                  <React.Fragment key={d.day}>
                    <Rect
                      x={x}
                      y={y}
                      width={28}
                      height={height}
                      rx={6}
                      fill={barColor}
                      opacity={d.day === 'Thu' ? 1 : 0.9}
                    />
                  </React.Fragment>
                );
              })}
            </Svg>

            {/* X-axis labels */}
            <View style={styles.xAxisRow}>
              {adherenceData.map((d) => (
                <Text
                  key={d.day}
                  style={[
                    styles.xLabel,
                    d.isSurplus && { color: '#F87171' },
                    d.day === 'Thu' && { color: CalorixColors.primary, fontWeight: '700' },
                  ]}
                >
                  {d.day}
                </Text>
              ))}
            </View>
          </View>

          {/* Legend Footer */}
          <View style={styles.legendFooter}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: CalorixColors.primary }]} />
              <Text style={styles.legendText}>{underCount} Under Target</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F87171' }]} />
              <Text style={styles.legendText}>{overCount} Over Target</Text>
            </View>
            <Text style={styles.budgetRem}>
              Remaining: <Text style={{ color: CalorixColors.primary, fontWeight: '700' }}>110 kcal</Text>
            </Text>
          </View>
        </View>

        {/* Macro Distribution Split Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.cardHeaderTag}>
                <Text style={styles.tagText}>MACRO DISTRIBUTION</Text>
              </View>
              <Text style={styles.cardTitle}>Daily Balance</Text>
            </View>
          </View>

          {/* Donut and details */}
          <View style={styles.donutRow}>
            {/* Donut Chart */}
            <View style={styles.donutContainer}>
              <Svg width={100} height={100} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx={50} cy={50} r={38} fill="none" stroke="#F3F4F6" strokeWidth={12} />
                {/* Protein: 31% */}
                <Circle
                  cx={50}
                  cy={50}
                  r={38}
                  fill="none"
                  stroke="#F87171"
                  strokeWidth={12}
                  strokeDasharray="74 239"
                  strokeLinecap="round"
                />
                {/* Carbs: 41% */}
                <Circle
                  cx={50}
                  cy={50}
                  r={38}
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth={12}
                  strokeDasharray="98 239"
                  strokeDashoffset={-77}
                  strokeLinecap="round"
                />
                {/* Fats: 28% */}
                <Circle
                  cx={50}
                  cy={50}
                  r={38}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth={12}
                  strokeDasharray="64 239"
                  strokeDashoffset={-178}
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.donutCenter}>
                <Text style={styles.donutVal}>100%</Text>
                <Text style={styles.donutLabel}>Profile</Text>
              </View>
            </View>

            {/* Macro detail bars */}
            <View style={styles.macroDetails}>
              {/* Protein */}
              <View style={styles.macroStat}>
                <View style={styles.macroStatHeader}>
                  <View style={styles.statDotRow}>
                    <View style={[styles.colorDot, { backgroundColor: '#F87171' }]} />
                    <Text style={styles.macroStatName}>Protein</Text>
                  </View>
                  <Text style={styles.macroStatVal}>
                    140g <Text style={styles.macroStatPct}>(31%)</Text>
                  </Text>
                </View>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { width: '31%', backgroundColor: '#F87171' }]} />
                </View>
              </View>

              {/* Carbs */}
              <View style={styles.macroStat}>
                <View style={styles.macroStatHeader}>
                  <View style={styles.statDotRow}>
                    <View style={[styles.colorDot, { backgroundColor: '#0EA5E9' }]} />
                    <Text style={styles.macroStatName}>Carbs</Text>
                  </View>
                  <Text style={styles.macroStatVal}>
                    185g <Text style={styles.macroStatPct}>(41%)</Text>
                  </Text>
                </View>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { width: '41%', backgroundColor: '#0EA5E9' }]} />
                </View>
              </View>

              {/* Fats */}
              <View style={styles.macroStat}>
                <View style={styles.macroStatHeader}>
                  <View style={styles.statDotRow}>
                    <View style={[styles.colorDot, { backgroundColor: '#8B5CF6' }]} />
                    <Text style={styles.macroStatName}>Fats</Text>
                  </View>
                  <Text style={styles.macroStatVal}>
                    56g <Text style={styles.macroStatPct}>(28%)</Text>
                  </Text>
                </View>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { width: '28%', backgroundColor: '#8B5CF6' }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Body Weight & Forecast Trendline Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.cardHeaderTag}>
                <Text style={styles.tagText}>MASS TELEMETRY</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricVal}>{profile.currentWeightKg}</Text>
                <Text style={styles.metricUnit}>kg</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendBadgeText}>↓ 1.3 kg this mo</Text>
                </View>
              </View>
            </View>
            <View style={styles.scaleIconWrap}>
              <Text style={styles.scaleIcon}>⚖️</Text>
            </View>
          </View>

          {/* Sparkline Graph */}
          <View style={styles.sparklineContainer}>
            <Svg width="100%" height={90} viewBox="0 0 300 80">
              <Defs>
                <LinearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <Stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>
              <Line x1="0" y1="40" x2="300" y2="40" stroke="#E5E7EB" strokeWidth={1} strokeDasharray="3 3" />
              <Polygon
                points="0,20 40,24 80,32 130,28 180,45 230,42 270,58 300,64 300,80 0,80"
                fill="url(#weightGrad)"
              />
              <Polyline
                points="0,20 40,24 80,32 130,28 180,45 230,42 270,58 300,64"
                fill="none"
                stroke={CalorixColors.primary}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx={300} cy={64} r={5} fill={CalorixColors.primary} />
              <Circle cx={300} cy={64} r={9} fill={CalorixColors.primary} opacity={0.25} />
            </Svg>
            <View style={styles.sparklineLabels}>
              <Text style={styles.sparklineLabel}>Oct 1 (68.5 kg)</Text>
              <Text style={styles.sparklineLabel}>Mid-Period</Text>
              <Text style={[styles.sparklineLabel, { color: CalorixColors.text, fontWeight: '700' }]}>
                Today (67.2 kg)
              </Text>
            </View>
          </View>

          {/* AI Milestone Forecast */}
          <View style={styles.forecastBox}>
            <Text style={styles.forecastText}>
              Projected to achieve target <Text style={{ fontWeight: '700', color: '#065F46' }}>64.0 kg</Text> by Nov 28 based on current caloric deficit.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  exportBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportIcon: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CalorixSpacing.md,
    gap: CalorixSpacing.md,
  },
  periodBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: CalorixRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: CalorixRadius.full,
  },
  periodBtnActive: {
    backgroundColor: CalorixColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: CalorixColors.textSecondary,
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  milestoneCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  milestoneGlow: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  milestoneContent: {
    flexDirection: 'row',
    gap: CalorixSpacing.md,
    alignItems: 'flex-start',
  },
  milestoneIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneIcon: {
    fontSize: 20,
  },
  milestoneInfo: {
    flex: 1,
    gap: 4,
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064E3B',
  },
  newBadge: {
    backgroundColor: CalorixColors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  milestoneSub: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 16,
  },
  card: {
    backgroundColor: CalorixColors.surface,
    borderRadius: CalorixRadius.xl,
    padding: CalorixSpacing.md,
    borderWidth: 1,
    borderColor: CalorixColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: CalorixSpacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderTag: {
    marginBottom: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.textMuted,
    letterSpacing: 0.5,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  metricVal: {
    fontSize: 24,
    fontWeight: '800',
    color: CalorixColors.text,
  },
  metricUnit: {
    fontSize: 12,
    color: CalorixColors.textMuted,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  goalPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: CalorixRadius.full,
  },
  goalPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  targetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dashIndicator: {
    width: 10,
    height: 2,
    backgroundColor: '#9CA3AF',
    borderRadius: 1,
  },
  targetLabel: {
    fontSize: 11,
    color: CalorixColors.textMuted,
  },
  targetDelta: {
    fontSize: 11,
    fontWeight: '600',
    color: CalorixColors.primary,
  },
  chartContainer: {
    gap: 6,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  xLabel: {
    fontSize: 11,
    color: CalorixColors.textMuted,
    fontWeight: '500',
    width: 32,
    textAlign: 'center',
  },
  legendFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: CalorixRadius.lg,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11,
    color: CalorixColors.textSecondary,
  },
  budgetRem: {
    fontSize: 11,
    color: CalorixColors.textSecondary,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  donutContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutVal: {
    fontSize: 16,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  donutLabel: {
    fontSize: 9,
    color: CalorixColors.textMuted,
    textTransform: 'uppercase',
  },
  macroDetails: {
    flex: 1,
    gap: 8,
  },
  macroStat: {
    gap: 3,
  },
  macroStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  colorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  macroStatName: {
    fontSize: 12,
    fontWeight: '600',
    color: CalorixColors.textSecondary,
  },
  macroStatVal: {
    fontSize: 12,
    fontWeight: '700',
    color: CalorixColors.text,
  },
  macroStatPct: {
    color: CalorixColors.textMuted,
    fontWeight: '400',
  },
  macroTrack: {
    height: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: CalorixRadius.full,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: CalorixRadius.full,
  },
  scaleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleIcon: {
    fontSize: 18,
  },
  trendBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: CalorixRadius.full,
  },
  trendBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: CalorixColors.primary,
  },
  sparklineContainer: {
    gap: 6,
  },
  sparklineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  sparklineLabel: {
    fontSize: 11,
    color: CalorixColors.textMuted,
  },
  forecastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(236, 253, 245, 0.7)',
    borderRadius: CalorixRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  forecastIcon: {
    fontSize: 16,
  },
  forecastText: {
    flex: 1,
    fontSize: 12,
    color: '#064E3B',
    lineHeight: 16,
  },
});

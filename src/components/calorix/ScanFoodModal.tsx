import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { CalorixColors, CalorixSpacing, CalorixRadius } from '@/constants/calorix-theme';

interface ScanFoodModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (food: {
    foodId: string;
    name: string;
    mealType: 'snacks';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion: string;
  }) => void;
}

type ScanState = 'idle' | 'scanning' | 'analyzing' | 'result';

const MOCK_SCAN_RESULTS = [
  { name: 'Greek Yogurt Parfait', calories: 280, protein: 18, carbs: 32, fat: 8, portion: '1 cup (250g)' },
  { name: 'Protein Energy Bar', calories: 210, protein: 20, carbs: 22, fat: 6, portion: '1 bar (60g)' },
  { name: 'Mixed Nuts', calories: 190, protein: 5, carbs: 8, fat: 16, portion: '30g' },
  { name: 'Whole Grain Crackers', calories: 120, protein: 3, carbs: 20, fat: 3, portion: '5 crackers (30g)' },
];

export function ScanFoodModal({ visible, onClose, onAdd }: ScanFoodModalProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [result, setResult] = useState<typeof MOCK_SCAN_RESULTS[number] | null>(null);

  function startScan() {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('analyzing');
      setTimeout(() => {
        const randomResult = MOCK_SCAN_RESULTS[Math.floor(Math.random() * MOCK_SCAN_RESULTS.length)];
        setResult(randomResult);
        setScanState('result');
      }, 1500);
    }, 1200);
  }

  function handleConfirm() {
    if (!result) return;
    onAdd({
      foodId: `scan_${Date.now()}`,
      name: result.name,
      mealType: 'snacks',
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      portion: result.portion,
    });
    resetState();
    onClose();
  }

  function resetState() {
    setScanState('idle');
    setResult(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Mock camera viewfinder */}
        <View style={styles.camera}>
          <View style={styles.cameraOverlay}>
            {/* Corner brackets */}
            <View style={styles.corners}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>

            {scanState === 'scanning' && (
              <View style={styles.scanLine} />
            )}

            {scanState === 'analyzing' && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color={CalorixColors.primary} />
                <Text style={styles.analyzingText}>AI analyzing food...</Text>
              </View>
            )}

            {scanState === 'result' && result && (
              <View style={styles.resultOverlay}>
                <Text style={styles.resultDetectedText}>✓ Food Detected</Text>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultCalories}>{result.calories} kcal</Text>
              </View>
            )}
          </View>

          {/* Camera UI overlay */}
          <View style={styles.topBar}>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✨ AI Vision</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.scanHint}>
            {scanState === 'idle' ? 'Point camera at food or barcode' :
             scanState === 'scanning' ? 'Scanning...' :
             scanState === 'analyzing' ? 'Analyzing nutrition data...' :
             'Food identified!'}
          </Text>
        </View>

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          {scanState === 'result' && result ? (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultCardTitle}>{result.name}</Text>
                  <Text style={styles.resultPortion}>{result.portion}</Text>
                </View>
                <Text style={styles.resultCardCalories}>{result.calories} kcal</Text>
              </View>
              <View style={styles.resultMacros}>
                <View style={styles.macroChip}>
                  <Text style={styles.macroChipValue}>{result.protein}g</Text>
                  <Text style={styles.macroChipLabel}>Protein</Text>
                </View>
                <View style={styles.macroChip}>
                  <Text style={styles.macroChipValue}>{result.carbs}g</Text>
                  <Text style={styles.macroChipLabel}>Carbs</Text>
                </View>
                <View style={styles.macroChip}>
                  <Text style={styles.macroChipValue}>{result.fat}g</Text>
                  <Text style={styles.macroChipLabel}>Fat</Text>
                </View>
              </View>
              <View style={styles.resultActions}>
                <Pressable onPress={resetState} style={styles.rescanBtn}>
                  <Text style={styles.rescanBtnText}>↺ Scan Again</Text>
                </Pressable>
                <Pressable onPress={handleConfirm} style={styles.confirmBtn}>
                  <Text style={styles.confirmBtnText}>Add to Log</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.scanControls}>
              <Pressable
                onPress={startScan}
                disabled={scanState !== 'idle'}
                style={({ pressed }) => [styles.scanBtn, scanState !== 'idle' && styles.scanBtnDisabled, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.scanBtnIcon}>{scanState === 'idle' ? '📸' : '⏳'}</Text>
                <Text style={styles.scanBtnText}>
                  {scanState === 'idle' ? 'Tap to Scan Food' : 'Scanning...'}
                </Text>
              </Pressable>
              <Text style={styles.scanSubtext}>AI will automatically identify food & calories</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: {
    flex: 1,
    backgroundColor: '#0F1117',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOverlay: {
    width: 260,
    height: 260,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corners: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: CalorixColors.primary,
    borderWidth: 3,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: CalorixColors.primary,
    opacity: 0.8,
  },
  analyzingOverlay: {
    alignItems: 'center',
    gap: 12,
  },
  analyzingText: {
    color: CalorixColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resultOverlay: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    borderRadius: CalorixRadius.lg,
    padding: CalorixSpacing.md,
  },
  resultDetectedText: {
    color: CalorixColors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resultName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultCalories: {
    color: CalorixColors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CalorixSpacing.md,
    paddingTop: 50,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  aiBadge: {
    backgroundColor: 'rgba(5,150,105,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: CalorixRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.5)',
  },
  aiBadgeText: { color: CalorixColors.primary, fontSize: 12, fontWeight: '700' },
  scanHint: {
    position: 'absolute',
    bottom: CalorixSpacing.xl,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
  },
  bottomPanel: {
    backgroundColor: CalorixColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: CalorixSpacing.lg,
  },
  scanControls: { alignItems: 'center', gap: CalorixSpacing.md, paddingVertical: CalorixSpacing.md },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: CalorixColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: CalorixRadius.full,
  },
  scanBtnDisabled: { opacity: 0.6 },
  scanBtnIcon: { fontSize: 20 },
  scanBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  scanSubtext: { fontSize: 12, color: CalorixColors.textMuted, textAlign: 'center' },
  resultCard: { gap: CalorixSpacing.md },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultCardTitle: { fontSize: 18, fontWeight: '700', color: CalorixColors.text },
  resultPortion: { fontSize: 12, color: CalorixColors.textMuted, marginTop: 2 },
  resultCardCalories: { fontSize: 24, fontWeight: '700', color: CalorixColors.primary },
  resultMacros: { flexDirection: 'row', gap: 10 },
  macroChip: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: CalorixRadius.lg,
    padding: 12,
    alignItems: 'center',
    gap: 2,
  },
  macroChipValue: { fontSize: 16, fontWeight: '700', color: CalorixColors.text },
  macroChipLabel: { fontSize: 10, color: CalorixColors.textMuted, textTransform: 'uppercase' },
  resultActions: { flexDirection: 'row', gap: 10 },
  rescanBtn: {
    flex: 1,
    padding: 14,
    borderRadius: CalorixRadius.xl,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  rescanBtnText: { fontSize: 14, fontWeight: '600', color: CalorixColors.textSecondary },
  confirmBtn: {
    flex: 2,
    padding: 14,
    borderRadius: CalorixRadius.xl,
    backgroundColor: CalorixColors.primary,
    alignItems: 'center',
  },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

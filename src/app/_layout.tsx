import React from 'react';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/services/AuthContext';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthModal } from '@/components/calorix/AuthModal';
import { OnboardingFlow } from '@/components/calorix/OnboardingFlow';
import { BrandLogo } from '@/components/calorix/BrandLogo';
import { CalorixColors } from '@/constants/calorix-theme';

SplashScreen.preventAutoHideAsync();

function MainContent() {
  const { user, isLoading } = useAuth();
  const { hasCompletedOnboarding, completeOnboarding } = useApp();

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn('[CALORIX] Error hiding splash screen:', err);
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <BrandLogo variant="symbol" width={64} height={64} />
        <BrandLogo variant="wordmark" width={160} height={29} style={{ marginTop: 16 }} />
        <ActivityIndicator size="small" color={CalorixColors.primary} style={{ marginTop: 16 }} />
        <Text style={styles.loadingSub}>Synchronizing metabolic state...</Text>
      </View>
    );
  }

  // If user is not authenticated, display CALORIX Auth flow
  if (!user) {
    return <AuthModal visible={true} />;
  }

  // If user is authenticated but has not completed onboarding
  if (!hasCompletedOnboarding) {
    return (
      <OnboardingFlow
        onComplete={async (profileData, plan) => {
          await completeOnboarding(profileData, plan);
        }}
      />
    );
  }

  // Authenticated + Onboarded user enters main CALORIX application
  return (
    <>
      <AnimatedSplashOverlay />
      <AppTabs />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: CalorixColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSub: {
    fontSize: 12,
    color: CalorixColors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
});

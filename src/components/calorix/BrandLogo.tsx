import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Path,
  G,
} from 'react-native-svg';

export type BrandVariant =
  | 'full'          // calorix-logo.svg
  | 'full-black'    // calorix-logo-black.svg
  | 'full-white'    // calorix-logo-white.svg
  | 'symbol'        // calorix-symbol.svg
  | 'symbol-black'  // calorix-symbol-black.svg
  | 'symbol-white'  // calorix-symbol-white.svg
  | 'symbol-dark'   // calorix-symbol-dark.svg
  | 'wordmark'      // calorix-wordmark.svg
  | 'wordmark-black'// calorix-wordmark-black.svg
  | 'wordmark-white'// calorix-wordmark-white.svg

export interface BrandLogoProps {
  variant?: BrandVariant;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Official CALORIX Bio-Arc Brand Identity Component.
 * Faithfully renders exact vector paths and gradients from assets/brand/*.svg
 */
export function BrandLogo({
  variant = 'full',
  width,
  height,
  style,
}: BrandLogoProps) {
  if (variant === 'symbol') {
    const size = width || height || 32;
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg viewBox="0 0 48 48" width="100%" height="100%">
          <Defs>
            <LinearGradient
              id="calorix-arc-grad-sym"
              x1="12"
              y1="12"
              x2="36"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#06B6D4" />
              <Stop offset="100%" stopColor="#10B981" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeDasharray="2 4"
            strokeOpacity={0.8}
          />
          <Path
            d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
            stroke="url(#calorix-arc-grad-sym)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
            stroke="#10B981"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Circle cx="24" cy="24" r="5" fill="#059669" />
        </Svg>
      </View>
    );
  }

  if (variant === 'symbol-black') {
    const size = width || height || 32;
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg viewBox="0 0 48 48" width="100%" height="100%">
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#000000"
            strokeWidth="3"
            strokeDasharray="2 4"
            strokeOpacity={0.15}
          />
          <Path
            d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Circle cx="24" cy="24" r="5" fill="#000000" />
        </Svg>
      </View>
    );
  }

  if (variant === 'symbol-white') {
    const size = width || height || 32;
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg viewBox="0 0 48 48" width="100%" height="100%">
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="2 4"
            strokeOpacity={0.25}
          />
          <Path
            d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Circle cx="24" cy="24" r="5" fill="#FFFFFF" />
        </Svg>
      </View>
    );
  }

  if (variant === 'symbol-dark') {
    const size = width || height || 32;
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg viewBox="0 0 48 48" width="100%" height="100%">
          <Defs>
            <LinearGradient
              id="calorix-arc-dark-grad-sym"
              x1="12"
              y1="12"
              x2="36"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="100%" stopColor="#34D399" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#1E293B"
            strokeWidth="3"
            strokeDasharray="2 4"
          />
          <Path
            d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
            stroke="url(#calorix-arc-dark-grad-sym)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
            stroke="#34D399"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Circle cx="24" cy="24" r="5" fill="#10B981" />
        </Svg>
      </View>
    );
  }

  if (variant === 'wordmark') {
    const w = width || 176;
    const h = height || (w * 32) / 176;
    return (
      <View style={[{ width: w, height: h }, style]}>
        <Svg viewBox="0 0 176 32" width="100%" height="100%">
          <G fill="#0F172A">
            <Path d="M 21 11.5 C 19.8 8.8 17.2 7 13.5 7 C 8.8 7 5 11 5 16 C 5 21 8.8 25 13.5 25 C 17.2 25 19.8 23.2 21 20.5 L 17.2 19 C 16.4 20.8 15.1 21.6 13.5 21.6 C 10.7 21.6 8.5 19.2 8.5 16 C 8.5 12.8 10.7 10.4 13.5 10.4 C 15.1 10.4 16.4 11.2 17.2 13 Z" />
            <Path d="M 33.7 7 L 38.3 7 L 45.8 25 L 42 25 L 40.2 20.6 L 31.8 20.6 L 30 25 L 26.2 25 Z M 36 10.5 L 33.1 17.4 L 38.9 17.4 Z" />
            <Path d="M 50 7 L 53.6 7 L 53.6 21.6 L 64 21.6 L 64 25 L 50 25 Z" />
            <Path d="M 79 7 C 73.5 7 69 11 69 16 C 69 21 73.5 25 79 25 C 84.5 25 89 21 89 16 C 89 11 84.5 7 79 7 Z M 79 10.4 C 82.5 10.4 85.3 12.8 85.3 16 C 85.3 19.2 82.5 21.6 79 21.6 C 75.5 21.6 72.7 19.2 72.7 16 C 72.7 12.8 75.5 10.4 79 10.4 Z" />
            <Path d="M 94 7 L 104.5 7 C 108.8 7 111.8 9.5 111.8 13.2 C 111.8 15.8 110.1 17.8 107.5 18.7 L 112.5 25 L 108.2 25 L 103.7 19.2 L 97.6 19.2 L 97.6 25 L 94 25 Z M 97.6 10.3 L 97.6 15.9 L 104.2 15.9 C 106.6 15.9 108.1 14.8 108.1 13.1 C 108.1 11.4 106.6 10.3 104.2 10.3 Z" />
            <Path d="M 118 7 L 121.6 7 L 121.6 25 L 118 25 Z" />
            <Path d="M 126.5 7 L 130.6 7 L 136 14.8 L 141.4 7 L 145.5 7 L 138.1 16 L 146 25 L 141.8 25 L 136 17.2 L 130.2 25 L 126 25 L 133.9 16 Z" />
          </G>
          <Circle cx="152" cy="22" r="3" fill="#10B981" />
        </Svg>
      </View>
    );
  }

  if (variant === 'wordmark-black') {
    const w = width || 176;
    const h = height || (w * 32) / 176;
    return (
      <View style={[{ width: w, height: h }, style]}>
        <Svg viewBox="0 0 176 32" width="100%" height="100%">
          <G fill="#000000">
            <Path d="M 21 11.5 C 19.8 8.8 17.2 7 13.5 7 C 8.8 7 5 11 5 16 C 5 21 8.8 25 13.5 25 C 17.2 25 19.8 23.2 21 20.5 L 17.2 19 C 16.4 20.8 15.1 21.6 13.5 21.6 C 10.7 21.6 8.5 19.2 8.5 16 C 8.5 12.8 10.7 10.4 13.5 10.4 C 15.1 10.4 16.4 11.2 17.2 13 Z" />
            <Path d="M 33.7 7 L 38.3 7 L 45.8 25 L 42 25 L 40.2 20.6 L 31.8 20.6 L 30 25 L 26.2 25 Z M 36 10.5 L 33.1 17.4 L 38.9 17.4 Z" />
            <Path d="M 50 7 L 53.6 7 L 53.6 21.6 L 64 21.6 L 64 25 L 50 25 Z" />
            <Path d="M 79 7 C 73.5 7 69 11 69 16 C 69 21 73.5 25 79 25 C 84.5 25 89 21 89 16 C 89 11 84.5 7 79 7 Z M 79 10.4 C 82.5 10.4 85.3 12.8 85.3 16 C 85.3 19.2 82.5 21.6 79 21.6 C 75.5 21.6 72.7 19.2 72.7 16 C 72.7 12.8 75.5 10.4 79 10.4 Z" />
            <Path d="M 94 7 L 104.5 7 C 108.8 7 111.8 9.5 111.8 13.2 C 111.8 15.8 110.1 17.8 107.5 18.7 L 112.5 25 L 108.2 25 L 103.7 19.2 L 97.6 19.2 L 97.6 25 L 94 25 Z M 97.6 10.3 L 97.6 15.9 L 104.2 15.9 C 106.6 15.9 108.1 14.8 108.1 13.1 C 108.1 11.4 106.6 10.3 104.2 10.3 Z" />
            <Path d="M 118 7 L 121.6 7 L 121.6 25 L 118 25 Z" />
            <Path d="M 126.5 7 L 130.6 7 L 136 14.8 L 141.4 7 L 145.5 7 L 138.1 16 L 146 25 L 141.8 25 L 136 17.2 L 130.2 25 L 126 25 L 133.9 16 Z" />
            <Circle cx="152" cy="22" r="3" />
          </G>
        </Svg>
      </View>
    );
  }

  if (variant === 'wordmark-white') {
    const w = width || 176;
    const h = height || (w * 32) / 176;
    return (
      <View style={[{ width: w, height: h }, style]}>
        <Svg viewBox="0 0 176 32" width="100%" height="100%">
          <G fill="#FFFFFF">
            <Path d="M 21 11.5 C 19.8 8.8 17.2 7 13.5 7 C 8.8 7 5 11 5 16 C 5 21 8.8 25 13.5 25 C 17.2 25 19.8 23.2 21 20.5 L 17.2 19 C 16.4 20.8 15.1 21.6 13.5 21.6 C 10.7 21.6 8.5 19.2 8.5 16 C 8.5 12.8 10.7 10.4 13.5 10.4 C 15.1 10.4 16.4 11.2 17.2 13 Z" />
            <Path d="M 33.7 7 L 38.3 7 L 45.8 25 L 42 25 L 40.2 20.6 L 31.8 20.6 L 30 25 L 26.2 25 Z M 36 10.5 L 33.1 17.4 L 38.9 17.4 Z" />
            <Path d="M 50 7 L 53.6 7 L 53.6 21.6 L 64 21.6 L 64 25 L 50 25 Z" />
            <Path d="M 79 7 C 73.5 7 69 11 69 16 C 69 21 73.5 25 79 25 C 84.5 25 89 21 89 16 C 89 11 84.5 7 79 7 Z M 79 10.4 C 82.5 10.4 85.3 12.8 85.3 16 C 85.3 19.2 82.5 21.6 79 21.6 C 75.5 21.6 72.7 19.2 72.7 16 C 72.7 12.8 75.5 10.4 79 10.4 Z" />
            <Path d="M 94 7 L 104.5 7 C 108.8 7 111.8 9.5 111.8 13.2 C 111.8 15.8 110.1 17.8 107.5 18.7 L 112.5 25 L 108.2 25 L 103.7 19.2 L 97.6 19.2 L 97.6 25 L 94 25 Z M 97.6 10.3 L 97.6 15.9 L 104.2 15.9 C 106.6 15.9 108.1 14.8 108.1 13.1 C 108.1 11.4 106.6 10.3 104.2 10.3 Z" />
            <Path d="M 118 7 L 121.6 7 L 121.6 25 L 118 25 Z" />
            <Path d="M 126.5 7 L 130.6 7 L 136 14.8 L 141.4 7 L 145.5 7 L 138.1 16 L 146 25 L 141.8 25 L 136 17.2 L 130.2 25 L 126 25 L 133.9 16 Z" />
            <Circle cx="152" cy="22" r="3" />
          </G>
        </Svg>
      </View>
    );
  }

  if (variant === 'full-black') {
    const w = width || 236;
    const h = height || (w * 48) / 236;
    return (
      <View style={[{ width: w, height: h }, style]}>
        <Svg viewBox="0 0 236 48" width="100%" height="100%">
          {/* Bio-Arc Symbol (Black) */}
          <G transform="translate(0, 0)">
            <Circle
              cx="24"
              cy="24"
              r="20"
              stroke="#000000"
              strokeWidth="3"
              strokeDasharray="2 4"
              strokeOpacity={0.15}
            />
            <Path
              d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
              stroke="#000000"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <Path
              d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
              stroke="#000000"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <Circle cx="24" cy="24" r="5" fill="#000000" />
          </G>
          {/* Wordmark (Black) */}
          <G transform="translate(60, 8)" fill="#000000">
            <Path d="M 21 11.5 C 19.8 8.8 17.2 7 13.5 7 C 8.8 7 5 11 5 16 C 5 21 8.8 25 13.5 25 C 17.2 25 19.8 23.2 21 20.5 L 17.2 19 C 16.4 20.8 15.1 21.6 13.5 21.6 C 10.7 21.6 8.5 19.2 8.5 16 C 8.5 12.8 10.7 10.4 13.5 10.4 C 15.1 10.4 16.4 11.2 17.2 13 Z" />
            <Path d="M 33.7 7 L 38.3 7 L 45.8 25 L 42 25 L 40.2 20.6 L 31.8 20.6 L 30 25 L 26.2 25 Z M 36 10.5 L 33.1 17.4 L 38.9 17.4 Z" />
            <Path d="M 50 7 L 53.6 7 L 53.6 21.6 L 64 21.6 L 64 25 L 50 25 Z" />
            <Path d="M 79 7 C 73.5 7 69 11 69 16 C 69 21 73.5 25 79 25 C 84.5 25 89 21 89 16 C 89 11 84.5 7 79 7 Z M 79 10.4 C 82.5 10.4 85.3 12.8 85.3 16 C 85.3 19.2 82.5 21.6 79 21.6 C 75.5 21.6 72.7 19.2 72.7 16 C 72.7 12.8 75.5 10.4 79 10.4 Z" />
            <Path d="M 94 7 L 104.5 7 C 108.8 7 111.8 9.5 111.8 13.2 C 111.8 15.8 110.1 17.8 107.5 18.7 L 112.5 25 L 108.2 25 L 103.7 19.2 L 97.6 19.2 L 97.6 25 L 94 25 Z M 97.6 10.3 L 97.6 15.9 L 104.2 15.9 C 106.6 15.9 108.1 14.8 108.1 13.1 C 108.1 11.4 106.6 10.3 104.2 10.3 Z" />
            <Path d="M 118 7 L 121.6 7 L 121.6 25 L 118 25 Z" />
            <Path d="M 126.5 7 L 130.6 7 L 136 14.8 L 141.4 7 L 145.5 7 L 138.1 16 L 146 25 L 141.8 25 L 136 17.2 L 130.2 25 L 126 25 L 133.9 16 Z" />
            <Circle cx="152" cy="22" r="3" />
          </G>
        </Svg>
      </View>
    );
  }

  if (variant === 'full-white') {
    const w = width || 236;
    const h = height || (w * 48) / 236;
    return (
      <View style={[{ width: w, height: h }, style]}>
        <Svg viewBox="0 0 236 48" width="100%" height="100%">
          {/* Bio-Arc Symbol (White) */}
          <G transform="translate(0, 0)">
            <Circle
              cx="24"
              cy="24"
              r="20"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeDasharray="2 4"
              strokeOpacity={0.25}
            />
            <Path
              d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <Path
              d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <Circle cx="24" cy="24" r="5" fill="#FFFFFF" />
          </G>
          {/* Wordmark (White) */}
          <G transform="translate(60, 8)" fill="#FFFFFF">
            <Path d="M 21 11.5 C 19.8 8.8 17.2 7 13.5 7 C 8.8 7 5 11 5 16 C 5 21 8.8 25 13.5 25 C 17.2 25 19.8 23.2 21 20.5 L 17.2 19 C 16.4 20.8 15.1 21.6 13.5 21.6 C 10.7 21.6 8.5 19.2 8.5 16 C 8.5 12.8 10.7 10.4 13.5 10.4 C 15.1 10.4 16.4 11.2 17.2 13 Z" />
            <Path d="M 33.7 7 L 38.3 7 L 45.8 25 L 42 25 L 40.2 20.6 L 31.8 20.6 L 30 25 L 26.2 25 Z M 36 10.5 L 33.1 17.4 L 38.9 17.4 Z" />
            <Path d="M 50 7 L 53.6 7 L 53.6 21.6 L 64 21.6 L 64 25 L 50 25 Z" />
            <Path d="M 79 7 C 73.5 7 69 11 69 16 C 69 21 73.5 25 79 25 C 84.5 25 89 21 89 16 C 89 11 84.5 7 79 7 Z M 79 10.4 C 82.5 10.4 85.3 12.8 85.3 16 C 85.3 19.2 82.5 21.6 79 21.6 C 75.5 21.6 72.7 19.2 72.7 16 C 72.7 12.8 75.5 10.4 79 10.4 Z" />
            <Path d="M 94 7 L 104.5 7 C 108.8 7 111.8 9.5 111.8 13.2 C 111.8 15.8 110.1 17.8 107.5 18.7 L 112.5 25 L 108.2 25 L 103.7 19.2 L 97.6 19.2 L 97.6 25 L 94 25 Z M 97.6 10.3 L 97.6 15.9 L 104.2 15.9 C 106.6 15.9 108.1 14.8 108.1 13.1 C 108.1 11.4 106.6 10.3 104.2 10.3 Z" />
            <Path d="M 118 7 L 121.6 7 L 121.6 25 L 118 25 Z" />
            <Path d="M 126.5 7 L 130.6 7 L 136 14.8 L 141.4 7 L 145.5 7 L 138.1 16 L 146 25 L 141.8 25 L 136 17.2 L 130.2 25 L 126 25 L 133.9 16 Z" />
            <Circle cx="152" cy="22" r="3" />
          </G>
        </Svg>
      </View>
    );
  }

  // Default: Primary full-color horizontal logo (calorix-logo.svg)
  const w = width || 236;
  const h = height || (w * 48) / 236;

  return (
    <View style={[{ width: w, height: h }, style]}>
      <Svg viewBox="0 0 236 48" width="100%" height="100%">
        <Defs>
          <LinearGradient
            id="calorix-logo-arc-grad-main"
            x1="12"
            y1="12"
            x2="36"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#06B6D4" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>

        {/* BIO-ARC SYMBOL */}
        <G transform="translate(0, 0)">
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeDasharray="2 4"
            strokeOpacity={0.8}
          />
          <Path
            d="M 12 24 C 12 17.3726 17.3726 12 24 12 C 30.6274 12 36 17.3726 36 24"
            stroke="url(#calorix-logo-arc-grad-main)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Path
            d="M 36 24 C 36 30.6274 30.6274 36 24 36 C 18.5 36 14 32.5 12.6 28"
            stroke="#10B981"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Circle cx="24" cy="24" r="5" fill="#059669" />
        </G>

        {/* CALORIX WORDMARK */}
        <G transform="translate(60, 8)" fill="#0F172A">
          <Path d="M 21 11.5 C 19.8 8.8 17.2 7 13.5 7 C 8.8 7 5 11 5 16 C 5 21 8.8 25 13.5 25 C 17.2 25 19.8 23.2 21 20.5 L 17.2 19 C 16.4 20.8 15.1 21.6 13.5 21.6 C 10.7 21.6 8.5 19.2 8.5 16 C 8.5 12.8 10.7 10.4 13.5 10.4 C 15.1 10.4 16.4 11.2 17.2 13 Z" />
          <Path d="M 33.7 7 L 38.3 7 L 45.8 25 L 42 25 L 40.2 20.6 L 31.8 20.6 L 30 25 L 26.2 25 Z M 36 10.5 L 33.1 17.4 L 38.9 17.4 Z" />
          <Path d="M 50 7 L 53.6 7 L 53.6 21.6 L 64 21.6 L 64 25 L 50 25 Z" />
          <Path d="M 79 7 C 73.5 7 69 11 69 16 C 69 21 73.5 25 79 25 C 84.5 25 89 21 89 16 C 89 11 84.5 7 79 7 Z M 79 10.4 C 82.5 10.4 85.3 12.8 85.3 16 C 85.3 19.2 82.5 21.6 79 21.6 C 75.5 21.6 72.7 19.2 72.7 16 C 72.7 12.8 75.5 10.4 79 10.4 Z" />
          <Path d="M 94 7 L 104.5 7 C 108.8 7 111.8 9.5 111.8 13.2 C 111.8 15.8 110.1 17.8 107.5 18.7 L 112.5 25 L 108.2 25 L 103.7 19.2 L 97.6 19.2 L 97.6 25 L 94 25 Z M 97.6 10.3 L 97.6 15.9 L 104.2 15.9 C 106.6 15.9 108.1 14.8 108.1 13.1 C 108.1 11.4 106.6 10.3 104.2 10.3 Z" />
          <Path d="M 118 7 L 121.6 7 L 121.6 25 L 118 25 Z" />
          <Path d="M 126.5 7 L 130.6 7 L 136 14.8 L 141.4 7 L 145.5 7 L 138.1 16 L 146 25 L 141.8 25 L 136 17.2 L 130.2 25 L 126 25 L 133.9 16 Z" />
        </G>
        <Circle cx="212" cy="30" r="3" fill="#10B981" />
      </Svg>
    </View>
  );
}

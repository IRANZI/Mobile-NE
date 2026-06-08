// ============================================================
// Home Header — orange gradient block with tagline (reference UI)
// Shown on the home/search screen before a word is selected
// ============================================================

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import GeometricBackground from './GeometricBackground';

export default function HomeHeader() {
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale), [scale]);

  return (
    <LinearGradient
      colors={[colors.orangeGradientStart, colors.orangeGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative shapes inside the orange header */}
      <View style={styles.yellowDot} />
      <Ionicons
        name="star"
        size={scale(22)}
        color={colors.yellow}
        style={styles.starIcon}
      />

      {/* Tagline in serif font — matches reference design */}
      <Text style={styles.tagline}>
        The only English dictionary{'\n'}you need
      </Text>
    </LinearGradient>
  );
}

function createStyles(scale) {
  return StyleSheet.create({
    container: {
      borderBottomLeftRadius: scale(28),
      borderBottomRightRadius: scale(28),
      paddingHorizontal: scale(24),
      paddingTop: scale(20),
      paddingBottom: scale(48),
      overflow: 'hidden',
      minHeight: scale(160),
    },
    yellowDot: {
      position: 'absolute',
      top: scale(16),
      right: scale(50),
      width: scale(12),
      height: scale(12),
      borderRadius: scale(6),
      backgroundColor: colors.yellowBright,
      opacity: 0.4,
    },
    starIcon: {
      position: 'absolute',
      top: scale(14),
      right: scale(20),
    },
    tagline: {
      fontFamily: fonts.serif,
      fontSize: scale(26),
      fontWeight: '700',
      color: colors.white,
      lineHeight: scale(34),
      marginTop: scale(8),
    },
  });
}


// HomeHeader 

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import ThemeToggle from './ThemeToggle';

export default function HomeHeader() {
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  return (
    <LinearGradient
      colors={[colors.orangeGradientStart, colors.orangeGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/*  shapes inside the  header */}
      <View style={styles.yellowDot} />
      <View style={styles.toggleWrap}>
        <ThemeToggle color={colors.headerText} />
      </View>
      <Ionicons
        name="star"
        size={scale(22)}
        color={colors.yellow}
        style={styles.starIcon}
      />

      {/* Tagline  */}
      <Text style={styles.tagline}>
        The only English dictionary{'\n'}you need
      </Text>
    </LinearGradient>
  );
}

// Styles for the HomeHeader component, using responsive scaling for consistent design across devices.
function createStyles(scale, colors) {
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
      right: scale(58),
      width: scale(12),
      height: scale(12),
      borderRadius: scale(6),
      backgroundColor: colors.yellowBright,
      opacity: 0.4,
    },
    toggleWrap: {
      position: 'absolute',
      top: scale(10),
      right: scale(16),
      zIndex: 10,
    },
    starIcon: {
      position: 'absolute',
      top: scale(14),
      right: scale(52),
    },
    tagline: {
      fontFamily: fonts.serif,
      fontSize: scale(26),
      fontWeight: '700',
      color: colors.headerText,
      lineHeight: scale(34),
      marginTop: scale(8),
    },
  });
}

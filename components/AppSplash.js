// ============================================================
// App Splash — launch screen using assets/icon.png
// Shown on startup (works in Expo Go and native builds)
// ============================================================

import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

const appIcon = require('../assets/icon.png');

export default function AppSplash() {
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale), [scale]);

  return (
    <View style={styles.container}>
      <Image
        source={appIcon}
        style={styles.icon}
        resizeMode="contain"
        accessibilityLabel="LexiTech Dictionary"
      />
      <Text style={styles.title}>LexiTech Dictionary</Text>
    </View>
  );
}

function createStyles(scale) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(32),
    },
    icon: {
      width: scale(140),
      height: scale(140),
      borderRadius: scale(28),
      marginBottom: scale(24),
    },
    title: {
      fontFamily: fonts.serif,
      fontSize: scale(24),
      fontWeight: '700',
      color: colors.textDark,
      textAlign: 'center',
    },
  });
}

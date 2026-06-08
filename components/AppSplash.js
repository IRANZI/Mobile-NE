// App Splash Screen — follows system theme before ThemeProvider loads

import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { darkTheme, lightTheme } from '../constants/themes';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

const appIcon = require('../assets/icon.png');

export default function AppSplash() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkTheme : lightTheme;
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

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

function createStyles(scale, colors) {
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

// Simple light/dark theme toggle button

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../constants/responsive';

export default function ThemeToggle({ color, size }) {
  const { isDark, toggleTheme, colors } = useTheme();
  const { scale } = useResponsive();
  const iconSize = size ?? scale(22);
  const iconColor = color ?? colors.heroText;

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={styles.btn}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});

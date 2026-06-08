// Loading placeholder shown while fetching a word from history or drawer

import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeometricBackground from './GeometricBackground';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function WordHeroLoading({ word, onBack }) {
  const { colors } = useTheme();
  const { scale, heroWordSize } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const wordFontSize = heroWordSize(word?.length || 8);

  return (
    <View style={styles.wrapper}>
      <GeometricBackground variant="detail" />

      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={scale(28)} color={colors.heroText} />
        </TouchableOpacity>
        <ThemeToggle color={colors.heroText} />
      </View>

      <Text
        style={[styles.word, { fontSize: wordFontSize, lineHeight: wordFontSize + 8 }]}
        numberOfLines={2}
      >
        {word}
      </Text>

      <Text style={styles.subtitle}>Fetching definition...</Text>
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: colors.heroBg,
      paddingHorizontal: scale(20),
      paddingTop: scale(8),
      paddingBottom: scale(16),
      overflow: 'hidden',
      minHeight: scale(180),
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scale(8),
    },
    backBtn: {
      padding: scale(4),
    },
    word: {
      fontFamily: fonts.serif,
      fontWeight: '700',
      color: colors.heroText,
      textTransform: 'capitalize',
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.heroSubtext,
      marginTop: scale(6),
      fontStyle: 'italic',
    },
  });
}

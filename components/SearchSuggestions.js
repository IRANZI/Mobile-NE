// Autocomplete dropdown from search history

import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import { getSearchSuggestions } from '../utils/searchSuggestions';

export default function SearchSuggestions({
  query,
  history,
  visible = true,
  onSelect,
}) {
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  const suggestions = useMemo(
    () => getSearchSuggestions(query, history),
    [query, history]
  );

  if (!visible || suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>From your history</Text>
      {suggestions.map((word, index) => (
        <TouchableOpacity
          key={`${word}-${index}`}
          style={[styles.item, index === suggestions.length - 1 && styles.itemLast]}
          onPress={() => onSelect(word)}
          activeOpacity={0.75}
        >
          <Ionicons name="time-outline" size={scale(16)} color={colors.secondary} />
          <Text style={styles.word} numberOfLines={1}>
            {word}
          </Text>
          <Ionicons name="arrow-up-outline" size={scale(14)} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    container: {
      marginTop: scale(-12),
      marginBottom: scale(16),
      backgroundColor: colors.cardBg,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: scale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(8),
      elevation: 6,
    },
    label: {
      fontFamily: fonts.sans,
      fontSize: scale(11),
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      paddingBottom: scale(6),
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    itemLast: {},
    word: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '600',
      color: colors.textDark,
      textTransform: 'capitalize',
    },
  });
}

// ============================================================
// Search Bar — white rounded input overlapping the header
// Used on the home screen (reference design search bar)
// ============================================================

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  loading = false,
  style,
}) {
  const { scale, isSmall } = useResponsive();
  const styles = useMemo(() => createStyles(scale), [scale]);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        {/* Magnifying glass icon on the left */}
        <Ionicons name="search" size={scale(22)} color={colors.textGrey} />

        <TextInput
          style={[styles.input, { fontSize: scale(isSmall ? 15 : 16) }]}
          placeholder="Search"
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {/* Search / loading button on the right */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={styles.searchBtn}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : (
            <Ionicons name="arrow-forward-circle" size={scale(28)} color={colors.secondary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(scale) {
  return StyleSheet.create({
    wrapper: {
      marginTop: scale(-32),
      marginBottom: scale(20),
      zIndex: 10,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.searchBarBg,
      borderRadius: scale(30),
      paddingHorizontal: scale(18),
      paddingVertical: scale(14),
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: scale(6) },
      shadowOpacity: 0.18,
      shadowRadius: scale(12),
      elevation: 8,
      gap: scale(10),
    },
    input: {
      flex: 1,
      fontFamily: fonts.sans,
      color: colors.textDark,
      paddingVertical: 0,
    },
    searchBtn: {
      padding: scale(2),
    },
  });
}

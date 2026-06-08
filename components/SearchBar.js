// Search Bar Component

import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import { SEARCH_MAX_LENGTH } from '../utils/validateSearch';

const appIcon = require('../assets/icon.png');

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  loading = false,
  validationError = null,
  style,
  maxLength = SEARCH_MAX_LENGTH,
}) {
  const { colors } = useTheme();
  const { scale, isSmall } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const hasError = Boolean(validationError);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.container, hasError && styles.containerError]}>
        <Ionicons
          name="search"
          size={scale(22)}
          color={hasError ? colors.error : colors.textGrey}
        />

        <TextInput
          style={[styles.input, { fontSize: scale(isSmall ? 15 : 16) }]}
          placeholder="Search for a word..."
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          maxLength={maxLength}
          accessibilityLabel="Search for a word"
          accessibilityHint="Enter an English word and press search"
        />

        {value.length > 0 && !loading ? (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={scale(20)} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={styles.searchBtn}
          activeOpacity={0.8}
          accessibilityLabel="Search"
        >
          {loading ? (
            <Image source={appIcon} style={styles.loadingIcon} resizeMode="contain" />
          ) : (
            <Ionicons name="arrow-forward-circle" size={scale(28)} color={colors.secondary} />
          )}
        </TouchableOpacity>
      </View>

      {hasError ? (
        <View style={styles.feedbackRow}>
          <Ionicons name="information-circle" size={scale(16)} color={colors.error} />
          <View style={styles.feedbackText}>
            <Text style={styles.feedbackMessage}>{validationError.message}</Text>
            {validationError.hint ? (
              <Text style={styles.feedbackHint}>{validationError.hint}</Text>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function createStyles(scale, colors) {
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
    containerError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },
    input: {
      flex: 1,
      fontFamily: fonts.sans,
      color: colors.textDark,
      paddingVertical: 0,
    },
    clearBtn: {
      padding: scale(2),
    },
    searchBtn: {
      padding: scale(2),
    },
    loadingIcon: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(6),
    },
    feedbackRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: scale(8),
      marginTop: scale(10),
      paddingHorizontal: scale(8),
    },
    feedbackText: {
      flex: 1,
    },
    feedbackMessage: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      fontWeight: '600',
      color: colors.error,
      lineHeight: scale(18),
    },
    feedbackHint: {
      fontFamily: fonts.sans,
      fontSize: scale(12),
      color: colors.textGrey,
      marginTop: scale(2),
      lineHeight: scale(17),
    },
  });
}

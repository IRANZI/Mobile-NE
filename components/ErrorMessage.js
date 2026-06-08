// Error Message Component

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

const ERROR_META = {
  validation: {
    icon: 'information-circle',
    defaultTitle: 'Heads up',
  },
  not_found: {
    icon: 'search-outline',
    defaultTitle: 'Word not found',
  },
  network: {
    icon: 'cloud-offline-outline',
    defaultTitle: 'Connection problem',
  },
  server: {
    icon: 'server-outline',
    defaultTitle: 'Server error',
  },
  empty: {
    icon: 'document-outline',
    defaultTitle: 'No results',
  },
  unknown: {
    icon: 'alert-circle',
    defaultTitle: 'Something went wrong',
  },
};

export default function ErrorMessage({ error }) {
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  if (!error?.message) return null;

  const meta = ERROR_META[error.type] || ERROR_META.unknown;
  const title = error.title || meta.defaultTitle;

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Ionicons name={meta.icon} size={scale(24)} color={colors.error} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{error.message}</Text>
        {error.hint ? <Text style={styles.hint}>{error.hint}</Text> : null}
      </View>
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.errorBackground,
      borderRadius: scale(16),
      padding: scale(16),
      marginVertical: scale(12),
      gap: scale(12),
      borderWidth: 1,
      borderColor: colors.errorBorder,
    },
    textBlock: { flex: 1 },
    title: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '800',
      color: colors.error,
      marginBottom: scale(2),
    },
    message: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.errorText,
      lineHeight: scale(20),
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      color: colors.textGrey,
      marginTop: scale(6),
      lineHeight: scale(18),
    },
  });
}

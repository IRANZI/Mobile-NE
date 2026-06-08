// ============================================================
// Error Message — friendly error display for API/network errors
// ============================================================

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function ErrorMessage({ message }) {
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale), [scale]);

  if (!message) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={scale(24)} color={colors.error} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

function createStyles(scale) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.errorBackground,
      borderRadius: scale(16),
      padding: scale(16),
      marginVertical: scale(12),
      gap: scale(12),
      borderWidth: 1,
      borderColor: '#FFCDD2',
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
      color: '#B71C1C',
      lineHeight: scale(20),
    },
  });
}

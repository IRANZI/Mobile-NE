// Recent Words Scroll
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function RecentWordsScroll({ history, wordCache, onWordPress }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Recents</Text>
        <TouchableOpacity
          onPress={() => router.push('/history')}
          style={styles.viewAllBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllText}>View all</Text>
          <Ionicons name="chevron-forward" size={scale(14)} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {history.map((word, index) => {
          const cached = wordCache[word.toLowerCase()];
          const phonetic =
            cached?.phonetic || cached?.phonetics?.find((p) => p.text)?.text || '';
          const snippet =
            cached?.meanings?.[0]?.definitions?.[0]?.definition || '';

          return (
            <TouchableOpacity
              key={`${word}-${index}`}
              style={styles.card}
              onPress={() => onWordPress(word)}
              activeOpacity={0.85}
            >
              <Text style={styles.word} numberOfLines={1}>
                {word}
              </Text>
              {phonetic ? (
                <Text style={styles.phonetic} numberOfLines={1}>
                  {phonetic}
                </Text>
              ) : null}
              {snippet ? (
                <Text style={styles.snippet} numberOfLines={2}>
                  {snippet}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    section: {
      marginBottom: scale(24),
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(12),
      paddingHorizontal: scale(2),
    },
    sectionLabel: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      fontWeight: '600',
      color: colors.labelBlue,
    },
    viewAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(2),
    },
    viewAllText: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      fontWeight: '600',
      color: colors.secondary,
    },
    scrollContent: {
      gap: scale(12),
      paddingRight: scale(4),
    },
    card: {
      width: scale(160),
      backgroundColor: colors.cardBg,
      borderRadius: scale(16),
      padding: scale(16),
      borderWidth: 1,
      borderColor: colors.border,
    },
    word: {
      fontFamily: fonts.serif,
      fontSize: scale(20),
      fontWeight: '700',
      color: colors.textOnCard,
      textTransform: 'capitalize',
      marginBottom: scale(4),
    },
    phonetic: {
      fontFamily: fonts.sans,
      fontSize: scale(12),
      color: colors.textGrey,
      marginBottom: scale(6),
    },
    snippet: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      color: colors.textMuted,
      lineHeight: scale(18),
    },
  });
}

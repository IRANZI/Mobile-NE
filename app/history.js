// History.js - Displays the user's search history with options to revisit or clear entries.

import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDictionary } from '../context/DictionaryContext';
import { useAppAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAppAlert();
  const { searchHistory, wordCache, searchWord, clearHistory, removeFromHistory, loading } =
    useDictionary();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  // Confirm before wiping all history
  const handleClearHistory = () => {
    if (searchHistory.length === 0) return;

    showAlert(
      'Clear history',
      'Remove all searched words from your history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: clearHistory },
      ],
      { icon: 'trash-outline', variant: 'danger' }
    );
  };

  const handleWordPress = (word) => {
    router.push('/');
    searchWord(word);
  };

  const handleRemoveWord = (word) => {
    showAlert(
      'Remove from history',
      `Remove "${word}" from your search history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromHistory(word) },
      ],
      { icon: 'close-circle-outline', variant: 'danger' }
    );
  };

  const renderItem = ({ item, index }) => {
    const cached = wordCache[item.toLowerCase()];
    const phonetic =
      cached?.phonetic || cached?.phonetics?.find((p) => p.text)?.text || '';
    const snippet =
      cached?.meanings?.[0]?.definitions?.[0]?.definition || '';
    const partOfSpeech = cached?.meanings?.[0]?.partOfSpeech || '';

    return (
      <View style={styles.historyCard}>
        <TouchableOpacity
          style={styles.cardPressable}
          onPress={() => handleWordPress(item)}
          activeOpacity={0.8}
          disabled={loading}
        >
          <View style={styles.cardLeft}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.word}>{item}</Text>
              {phonetic || partOfSpeech ? (
                <Text style={styles.meta} numberOfLines={1}>
                  {phonetic}
                  {phonetic && partOfSpeech ? ' · ' : ''}
                  {partOfSpeech}
                </Text>
              ) : null}
              {snippet ? (
                <Text style={styles.snippet} numberOfLines={2}>
                  {snippet}
                </Text>
              ) : null}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={scale(20)} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemoveWord(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Remove ${item} from history`}
        >
          <Ionicons name="trash-outline" size={scale(18)} color={colors.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      {/* Page header with count and clear button */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Search History</Text>
          <Text style={styles.pageSubtitle}>
            {searchHistory.length} word{searchHistory.length !== 1 ? 's' : ''} saved
          </Text>
        </View>

        {searchHistory.length > 0 ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearHistory}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={scale(18)} color={colors.danger} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {searchHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="time-outline" size={scale(48)} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptyText}>
            Words you search will appear here. Open Word Search and look up a word to get started.
          </Text>
          <TouchableOpacity
            style={styles.goSearchBtn}
            onPress={() => router.push('/')}
            activeOpacity={0.85}
          >
            <Ionicons name="search" size={scale(18)} color={colors.iconOnPrimary} />
            <Text style={styles.goSearchText}>Go to Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={searchHistory}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    pageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: scale(20),
      paddingTop: scale(8),
      paddingBottom: scale(16),
    },
    pageTitle: {
      fontFamily: fonts.serif,
      fontSize: scale(26),
      fontWeight: '700',
      color: colors.textDark,
    },
    pageSubtitle: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.textGrey,
      marginTop: scale(4),
    },
    clearBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
      backgroundColor: colors.cardBg,
      paddingHorizontal: scale(14),
      paddingVertical: scale(10),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearText: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      fontWeight: '600',
      color: colors.danger,
    },
    listContent: {
      paddingHorizontal: scale(20),
      paddingBottom: scale(24),
      gap: scale(10),
    },
    historyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: scale(16),
      marginBottom: scale(10),
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    cardPressable: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(16),
      paddingRight: scale(8),
    },
    removeBtn: {
      paddingHorizontal: scale(14),
      paddingVertical: scale(16),
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
    },
    cardLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: scale(14),
    },
    numberBadge: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(10),
      backgroundColor: colors.cardBgElevated,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    numberText: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      fontWeight: '800',
      color: colors.secondary,
    },
    cardContent: {
      flex: 1,
    },
    word: {
      fontFamily: fonts.serif,
      fontSize: scale(20),
      fontWeight: '700',
      color: colors.textOnCard,
      textTransform: 'capitalize',
      marginBottom: scale(4),
    },
    meta: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      color: colors.textGrey,
      marginBottom: scale(6),
    },
    snippet: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.textMuted,
      lineHeight: scale(20),
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(32),
    },
    emptyIcon: {
      width: scale(96),
      height: scale(96),
      borderRadius: scale(48),
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(20),
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      fontFamily: fonts.serif,
      fontSize: scale(22),
      fontWeight: '700',
      color: colors.textDark,
      marginBottom: scale(10),
    },
    emptyText: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      color: colors.textGrey,
      textAlign: 'center',
      lineHeight: scale(24),
      marginBottom: scale(24),
    },
    goSearchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      backgroundColor: colors.secondary,
      paddingHorizontal: scale(24),
      paddingVertical: scale(14),
      borderRadius: scale(14),
    },
    goSearchText: {
      fontFamily: fonts.sans,
      fontSize: scale(16),
      fontWeight: '700',
      color: colors.iconOnPrimary,
    },
  });
}

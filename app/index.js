// ============================================================
// Main Search Screen — home view + word detail view
// Home: header, search bar, recents
// Detail: navy header with word + white definition sheet
// Compatible with Android and iOS via React Native / Expo
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDictionary } from '../context/DictionaryContext';
import HomeHeader from '../components/HomeHeader';
import SearchBar from '../components/SearchBar';
import RecentWordsScroll from '../components/RecentWordsScroll';
import WordHero from '../components/WordHero';
import DefinitionCard from '../components/DefinitionCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingImage from '../components/LoadingImage';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function SearchScreen() {
  const {
    wordData,
    wordCache,
    loading,
    error,
    searchHistory,
    searchWord,
    clearError,
    clearWord,
  } = useDictionary();

  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();
  const { scale, horizontalPad, contentMaxWidth } = useResponsive();

  const styles = useMemo(
    () => createStyles(scale, horizontalPad, contentMaxWidth),
    [scale, horizontalPad, contentMaxWidth]
  );

  // True when showing word detail (left phone in reference design)
  const isDetailView = Boolean(wordData && !loading);

  const handleSearch = () => {
    Keyboard.dismiss();
    clearError();
    const query = searchText.trim();
    if (!query) return;
    searchWord(query);
    setSearchText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* ─── DETAIL VIEW: word header + white definition sheet ─── */}
      {isDetailView ? (
        <View style={styles.detailContainer}>
          <WordHero wordData={wordData} onBack={clearWord} />

          {/* White bottom sheet with rounded top corners */}
          <View style={styles.definitionSheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.sheetContent,
                { paddingBottom: Math.max(insets.bottom, scale(24)) + scale(16) },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              {wordData.meanings?.length > 0 ? (
                wordData.meanings.map((meaning, index) => (
                  <DefinitionCard key={`meaning-${index}`} meaning={meaning} index={index} />
                ))
              ) : (
                <Text style={styles.noMeanings}>No meanings found.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      ) : (
        /* ─── HOME VIEW: header, search, recents ─── */
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.homeContent,
            { paddingBottom: Math.max(insets.bottom, scale(24)) + scale(16) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            {/* Orange gradient header block */}
            <HomeHeader />

            {/* White search bar overlapping the header */}
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onSubmit={handleSearch}
              loading={loading}
            />

            {/* Loading spinner while fetching from API */}
            {loading ? (
              <LoadingImage message="Searching dictionary..." />
            ) : null}

            {/* Error message (404, network, etc.) */}
            {error ? <ErrorMessage message={error.message} /> : null}

            {/* Horizontal recent words scroll */}
            {!loading ? (
              <RecentWordsScroll
                history={searchHistory}
                wordCache={wordCache}
                onWordPress={searchWord}
              />
            ) : null}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

function createStyles(scale, horizontalPad, contentMaxWidth) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: { flex: 1 },
    homeContent: {
      flexGrow: 1,
      alignItems: 'center',
    },
    inner: {
      width: '100%',
      maxWidth: contentMaxWidth,
      paddingHorizontal: horizontalPad,
    },
    detailContainer: {
      flex: 1,
    },
    definitionSheet: {
      flex: 1,
      backgroundColor: colors.sheetBg,
      borderTopLeftRadius: scale(28),
      borderTopRightRadius: scale(28),
      marginTop: scale(-12),
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: scale(-4) },
      shadowOpacity: 0.15,
      shadowRadius: scale(12),
      elevation: 10,
    },
    sheetContent: {
      padding: scale(20),
      paddingTop: scale(24),
    },
    noMeanings: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      color: colors.textGrey,
      textAlign: 'center',
      paddingVertical: scale(20),
    },
  });
}

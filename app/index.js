// SearchScreen.js - Main screen with search bar, recent words, and word details

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
import SearchSuggestions from '../components/SearchSuggestions';
import RecentWordsScroll from '../components/RecentWordsScroll';
import WordHero from '../components/WordHero';
import WordHeroLoading from '../components/WordHeroLoading';
import DefinitionCard from '../components/DefinitionCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingImage from '../components/LoadingImage';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import { validateSearchQuery } from '../utils/validateSearch';

export default function SearchScreen() {
  const {
    wordData,
    wordCache,
    loading,
    error,
    searchHistory,
    activeSearchWord,
    searchWord,
    retryLastSearch,
    clearError,
    clearWord,
  } = useDictionary();

  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [validationError, setValidationError] = useState(null);
  const insets = useSafeAreaInsets();
  const { scale, horizontalPad, contentMaxWidth } = useResponsive();

  const styles = useMemo(
    () => createStyles(scale, horizontalPad, contentMaxWidth, colors),
    [scale, horizontalPad, contentMaxWidth, colors]
  );

  const isFetchingDetail = Boolean(loading && activeSearchWord);
  const isDetailView = Boolean(wordData && !loading) || isFetchingDetail;

  const handleSearch = (wordOverride) => {
    Keyboard.dismiss();
    clearError();

    const query = typeof wordOverride === 'string' ? wordOverride : searchText;
    const validation = validateSearchQuery(query);
    if (!validation.valid) {
      setValidationError(validation);
      return;
    }

    setValidationError(null);
    setSearchText(validation.word);
    searchWord(validation.word);
  };

  const handleChangeText = (text) => {
    setSearchText(text);
    if (validationError) setValidationError(null);
    if (error?.type === 'validation') clearError();
  };

  const handleSuggestionSelect = (word) => {
    setSearchText(word);
    setValidationError(null);
    clearError();
    handleSearch(word);
  };

  const handleRecentPress = (word) => {
    setSearchText(word);
    setValidationError(null);
    clearError();
    searchWord(word);
  };

  const showSuggestions = !loading && searchText.trim().length > 0;

  const apiError = error && error.type !== 'validation' ? error : null;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* ─── DETAIL VIEW: word header + white definition sheet ─── */}
      {isDetailView ? (
        <View style={styles.detailContainer}>
          {isFetchingDetail ? (
            <WordHeroLoading word={activeSearchWord} onBack={clearWord} />
          ) : (
            <WordHero wordData={wordData} onBack={clearWord} />
          )}

          <View style={styles.definitionSheet}>
            {isFetchingDetail ? (
              <View style={styles.sheetLoading}>
                <LoadingImage message="Loading definition..." />
              </View>
            ) : (
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
            )}
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
              onChangeText={handleChangeText}
              onSubmit={() => handleSearch()}
              loading={loading}
              validationError={validationError}
            />

            <SearchSuggestions
              query={searchText}
              history={searchHistory}
              visible={showSuggestions}
              onSelect={handleSuggestionSelect}
            />

            {/* Loading spinner while fetching from API */}
            {loading ? (
              <LoadingImage message="Searching dictionary..." />
            ) : null}

            {/* Error message (404, network, etc.) */}
            {apiError ? (
              <ErrorMessage
                error={apiError}
                onRetry={retryLastSearch}
                retryLabel={
                  apiError.failedWord
                    ? `Retry "${apiError.failedWord}"`
                    : 'Try again'
                }
              />
            ) : null}

            {/* Horizontal recent words scroll */}
            {!loading ? (
              <RecentWordsScroll
                history={searchHistory}
                wordCache={wordCache}
                onWordPress={handleRecentPress}
              />
            ) : null}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

function createStyles(scale, horizontalPad, contentMaxWidth, colors) {
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
      borderTopWidth: 1,
      borderColor: colors.sheetBorder,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: scale(-4) },
      shadowOpacity: colors.sheetShadowOpacity,
      shadowRadius: scale(12),
      elevation: 10,
    },
    sheetContent: {
      padding: scale(20),
      paddingTop: scale(24),
    },
    sheetLoading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scale(40),
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

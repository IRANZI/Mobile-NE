// Word Hero Component
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PronunciationPlayer from './PronunciationPlayer';
import GeometricBackground from './GeometricBackground';
import ThemeToggle from './ThemeToggle';
import { getAudioPhonetics } from '../services/dictionaryApi';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function WordHero({ wordData, onBack }) {
  const { colors } = useTheme();
  const { scale, heroWordSize } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!wordData) return null;

  const phoneticText =
    wordData.phonetic || wordData.phonetics?.find((p) => p.text)?.text || null;

  const partOfSpeech = wordData.meanings?.[0]?.partOfSpeech || '';
  const hasAudio = getAudioPhonetics(wordData.phonetics).length > 0;
  const wordFontSize = heroWordSize(wordData.word.length);

  return (
    <View style={styles.wrapper}>
      <GeometricBackground variant="detail" />

      {/* Top bar: back + theme toggle */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={scale(28)} color={colors.heroText} />
        </TouchableOpacity>
        <ThemeToggle color={colors.heroText} />
      </View>

      {/* Word row: large title + favorite star */}
      <View style={styles.wordRow}>
        <Text
          style={[styles.word, { fontSize: wordFontSize, lineHeight: wordFontSize + 8 }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {wordData.word}
        </Text>
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          style={styles.starBtn}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={scale(28)}
            color={colors.heroStar}
          />
        </TouchableOpacity>
      </View>

      {/* Phonetics and part of speech in light text */}
      <Text style={styles.phoneticLine}>
        {phoneticText || 'No phonetic available'}
        {partOfSpeech ? ` · ${partOfSpeech}` : ''}
      </Text>

      {/* Audio controls — hidden when no pronunciation URL exists */}
      <PronunciationPlayer phonetics={wordData.phonetics} wordKey={wordData.word} />

      {!hasAudio ? (
        <Text style={styles.noAudio}>No pronunciation audio available</Text>
      ) : null}
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: colors.heroBg,
      paddingHorizontal: scale(20),
      paddingTop: scale(8),
      paddingBottom: scale(24),
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
      alignSelf: 'flex-start',
      padding: scale(4),
    },
    wordRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: scale(12),
    },
    word: {
      flex: 1,
      fontFamily: fonts.serif,
      fontWeight: '700',
      color: colors.heroText,
      textTransform: 'capitalize',
    },
    starBtn: {
      paddingTop: scale(4),
    },
    phoneticLine: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      color: colors.heroSubtext,
      marginTop: scale(8),
      fontStyle: 'italic',
    },
    noAudio: {
      fontFamily: fonts.sans,
      fontSize: scale(12),
      color: colors.heroMuted,
      marginTop: scale(8),
      fontStyle: 'italic',
    },
  });
}

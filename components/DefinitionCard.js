// Definition Card

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function DefinitionCard({ meaning, index }) {
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  if (!meaning) return null;

  return (
    <View style={styles.card}>
      {/* Context label */}
      <Text style={styles.contextLabel}>
        ({meaning.partOfSpeech?.toUpperCase() || 'GENERAL'})
      </Text>

      {meaning.definitions?.length > 0 ? (
        meaning.definitions.map((def, defIndex) => (
          <View
            key={`def-${defIndex}`}
            style={[
              styles.defBlock,
              defIndex === meaning.definitions.length - 1 && styles.lastBlock,
            ]}
          >
            {/* Main definition  */}
            <Text style={styles.definition}>{def.definition}</Text>

            {/* Example sentence  */}
            {def.example ? (
              <Text style={styles.example}>"{def.example}"</Text>
            ) : null}

            {/* Synonyms  */}
            {def.synonyms?.length > 0 ? (
              <View style={styles.synonymsRow}>
                {def.synonyms.slice(0, 4).map((syn, i) => (
                  <View key={i} style={styles.synonymChip}>
                    <Text style={styles.synonymText}>{syn}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={styles.noDef}>No definitions available.</Text>
      )}
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: scale(16),
      padding: scale(20),
      marginBottom: scale(14),
      borderWidth: 1,
      borderColor: colors.border,
    },
    contextLabel: {
      fontFamily: fonts.sans,
      fontSize: scale(11),
      fontWeight: '700',
      color: colors.secondary,
      letterSpacing: 0.8,
      marginBottom: scale(12),
    },
    defBlock: {
      marginBottom: scale(16),
      paddingBottom: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastBlock: {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },
    definition: {
      fontFamily: fonts.sans,
      fontSize: scale(16),
      fontWeight: '700',
      color: colors.textOnCard,
      lineHeight: scale(24),
      marginBottom: scale(8),
    },
    example: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.textGrey,
      fontStyle: 'italic',
      lineHeight: scale(22),
    },
    synonymsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(6),
      marginTop: scale(10),
    },
    synonymChip: {
      backgroundColor: colors.synonymBg,
      paddingHorizontal: scale(10),
      paddingVertical: scale(4),
      borderRadius: scale(12),
    },
    synonymText: {
      fontFamily: fonts.sans,
      fontSize: scale(12),
      color: colors.secondary,
      fontWeight: '600',
    },
    noDef: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.textGrey,
    },
  });
}

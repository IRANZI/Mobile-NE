// Pronunciation Player Component

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { getAudioPhonetics } from '../services/dictionaryApi';
import { useTheme } from '../context/ThemeContext';
import { useAppAlert } from '../context/AlertContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

export default function PronunciationPlayer({ phonetics, wordKey }) {
  const { colors } = useTheme();
  const { showAlert } = useAppAlert();
  const { scale, isSmall } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  const soundRef = useRef(null);
  const [playbackState, setPlaybackState] = useState('idle');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const audioList = getAudioPhonetics(phonetics);
  const hasAudio = audioList.length > 0;
  const currentAudio = hasAudio ? audioList[selectedIndex] : null;

  // Stop and unload audio file from memory
  const stopAndUnload = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {
        // Sound may already be unloaded
      }
      soundRef.current = null;
    }
    setPlaybackState('idle');
  }, []);

  // Reset when the displayed word changes
  useEffect(() => {
    stopAndUnload();
    setSelectedIndex(0);
  }, [wordKey, stopAndUnload]);

  // Cleanup when component unmounts
  useEffect(() => () => { stopAndUnload(); }, [stopAndUnload]);

  // Hide entire player when API provides no audio URL
  if (!hasAudio) return null;

  const handlePlay = async () => {
    if (!currentAudio?.audio) return;

    try {
      if (playbackState === 'paused' && soundRef.current) {
        await soundRef.current.playAsync();
        setPlaybackState('playing');
        return;
      }

      setPlaybackState('loading');
      await stopAndUnload();
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      const { sound } = await Audio.Sound.createAsync({ uri: currentAudio.audio });
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setPlaybackState('idle');
          return;
        }
        if (status.isPlaying) setPlaybackState('playing');
        else if (status.positionMillis > 0) setPlaybackState('paused');
      });

      await sound.playAsync();
      setPlaybackState('playing');
    } catch {
      setPlaybackState('idle');
      showAlert(
        'Audio unavailable',
        'Pronunciation could not be played. Check your connection and try again.',
        [{ text: 'OK', style: 'default' }],
        { icon: 'volume-mute-outline', variant: 'info' }
      );
    }
  };

  const handlePause = async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
      setPlaybackState('paused');
    } catch {
      setPlaybackState('idle');
    }
  };

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isLoading = playbackState === 'loading';
  const isActive = isPlaying || isPaused;

  const btnSize = scale(38);
  const playSize = scale(44);

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        {/* Play button — speaker icon */}
        <TouchableOpacity
          style={[styles.btn, styles.playBtn, { width: playSize, height: playSize, borderRadius: playSize / 2 }, isPlaying && styles.playActive]}
          onPress={handlePlay}
          disabled={isLoading || isPlaying}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.iconOnPrimary} />
          ) : (
            <Ionicons name="volume-high" size={scale(20)} color={colors.iconOnPrimary} />
          )}
        </TouchableOpacity>

        {/* Pause button */}
        <TouchableOpacity
          style={[styles.btn, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 }, !isActive && styles.btnDisabled]}
          onPress={handlePause}
          disabled={!isPlaying}
          activeOpacity={0.8}
        >
          <Ionicons name="pause" size={scale(18)} color={isPlaying ? colors.heroBg : colors.heroMuted} />
        </TouchableOpacity>

        {/* Stop button */}
        <TouchableOpacity
          style={[styles.btn, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 }, !isActive && styles.btnDisabled]}
          onPress={stopAndUnload}
          disabled={!isActive}
          activeOpacity={0.8}
        >
          <Ionicons name="stop" size={scale(18)} color={isActive ? colors.heroStar : colors.heroMuted} />
        </TouchableOpacity>

        {!isSmall ? (
          <Text style={styles.status}>
            {isLoading && 'Loading...'}
            {isPlaying && 'Playing'}
            {isPaused && 'Paused'}
            {playbackState === 'idle' && 'Listen'}
          </Text>
        ) : null}
      </View>

      {/* Multiple accent options (US, UK, etc.) */}
      {audioList.length > 1 ? (
        <View style={styles.accentRow}>
          {audioList.map((item, index) => (
            <TouchableOpacity
              key={`${item.audio}-${index}`}
              style={[styles.accentChip, selectedIndex === index && styles.accentActive]}
              onPress={async () => {
                if (index === selectedIndex) return;
                await stopAndUnload();
                setSelectedIndex(index);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.accentText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    container: { marginTop: scale(14) },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: scale(8),
    },
    btn: {
      backgroundColor: colors.heroControlBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.heroControlBorder,
    },
    playBtn: { backgroundColor: colors.secondary, borderColor: colors.secondary },
    playActive: { backgroundColor: colors.success, borderColor: colors.success },
    btnDisabled: { opacity: 0.4 },
    status: {
      fontFamily: fonts.sans,
      fontSize: scale(13),
      color: colors.heroSubtext,
      fontWeight: '600',
      marginLeft: scale(4),
    },
    accentRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(8),
      marginTop: scale(10),
    },
    accentChip: {
      paddingHorizontal: scale(12),
      paddingVertical: scale(5),
      borderRadius: scale(14),
      backgroundColor: colors.heroControlBg,
      borderWidth: 1,
      borderColor: colors.heroControlBorder,
    },
    accentActive: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
    },
    accentText: {
      fontFamily: fonts.sans,
      fontSize: scale(12),
      color: colors.heroText,
      fontWeight: '600',
    },
  });
}

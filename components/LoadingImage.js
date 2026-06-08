
// Loading Image  when searching for a word in the dictionary. 

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

const appIcon = require('../assets/icon.png');

export default function LoadingImage({ message = 'Searching dictionary...' }) {
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const pulse = useRef(new Animated.Value(0.6)).current;

  // Soft pulse so the icon feels alive while loading
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={appIcon}
        style={[styles.icon, { opacity: pulse }]}
        resizeMode="contain"
        accessibilityLabel="Loading"
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scale(32),
      gap: scale(16),
    },
    icon: {
      width: scale(96),
      height: scale(96),
      borderRadius: scale(20),
    },
    message: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '600',
      color: colors.textGrey,
      textAlign: 'center',
    },
  });
}

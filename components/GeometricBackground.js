// ============================================================
// Geometric Background — decorative shapes from reference design
// Yellow circles and orange accents on navy background
// ============================================================

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { useResponsive } from '../constants/responsive';

export default function GeometricBackground({ variant = 'home' }) {
  const { scale, width } = useResponsive();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Yellow circle — top right (reference design) */}
      <View
        style={[
          styles.yellowCircle,
          {
            width: scale(variant === 'home' ? 80 : 100),
            height: scale(variant === 'home' ? 80 : 100),
            top: scale(10),
            right: scale(20),
          },
        ]}
      />
      {/* Orange triangle-like block — bottom left */}
      <View
        style={[
          styles.orangeBlock,
          {
            width: scale(60),
            height: scale(60),
            bottom: scale(40),
            left: scale(-10),
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      {/* Small yellow accent — detail screen only */}
      {variant === 'detail' ? (
        <View
          style={[
            styles.yellowSmall,
            {
              width: scale(40),
              height: scale(40),
              bottom: scale(20),
              right: scale(30),
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  yellowCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.yellow,
    opacity: 0.25,
  },
  orangeBlock: {
    position: 'absolute',
    backgroundColor: colors.secondary,
    opacity: 0.2,
    borderRadius: 8,
  },
  yellowSmall: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.yellow,
    opacity: 0.2,
  },
});

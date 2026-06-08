// ============================================================
// Typography — serif for word titles, sans-serif for body text
// Uses platform-native fonts (works on Android and iOS)
// ============================================================

import { Platform } from 'react-native';

export const fonts = {
  // Large word display (like "Besuch" / "Hebamme" in the reference)
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  // Body text, labels, definitions
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
};

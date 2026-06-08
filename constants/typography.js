// Typography Constants

import { Platform } from 'react-native';

export const fonts = {
  // Large word display 
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

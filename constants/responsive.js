// Responsive Design Utilities

import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 375;

/**
 * Scale a pixel value based on current screen width.
 * @param {number} size 
 * @param {number} screenWidth 
 */
export function scaleSize(size, screenWidth) {
  const ratio = screenWidth / BASE_WIDTH;
  const capped = Math.min(Math.max(ratio, 0.85), 1.25);
  return Math.round(size * capped);
}

/**
 * Hook that returns responsive layout values.
 * Use in any component
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 360;
  const isTablet = width >= 768;
  const isLargePhone = width >= 400;

  const scale = (size) => scaleSize(size, width);

  return {
    width,
    height,
    isSmall,
    isTablet,
    isLargePhone,
    scale,
    contentMaxWidth: isTablet ? 680 : width,
    horizontalPad: isTablet ? scale(28) : isSmall ? scale(12) : scale(20),
    drawerWidth: Math.min(Math.round(width * 0.82), isTablet ? 360 : 300),
    searchBtnSize: isSmall ? scale(48) : scale(52),
    heroWordSize: (wordLength) => {
      if (wordLength > 14) return scale(28);
      if (wordLength > 10) return scale(34);
      if (wordLength > 7) return scale(40);
      return scale(46);
    },
  };
}

// ============================================================
// Theme Context — light, dark, and system appearance modes
// Persists user choice with AsyncStorage
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../constants/themes';

const STORAGE_KEY = '@lexitech_theme_mode';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on app start
  useEffect(() => {
    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemeModeState(saved);
        }
      } catch {
        // Use default system mode if storage fails
      } finally {
        setIsLoaded(true);
      }
    }

    loadTheme();
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const colors = isDark ? darkTheme : lightTheme;

  const setThemeMode = useCallback(async (mode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Preference not saved — still applies for this session
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
  }, [isDark, setThemeMode]);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      themeMode,
      isLoaded,
      setThemeMode,
      toggleTheme,
    }),
    [colors, isDark, themeMode, isLoaded, setThemeMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Access current theme colors and theme controls from any component */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}

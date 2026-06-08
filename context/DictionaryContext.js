// Dictionary Context

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWordDefinition } from '../services/dictionaryApi';
import { validateSearchQuery } from '../utils/validateSearch';

const HISTORY_STORAGE_KEY = '@lexitech_search_history';
const MAX_HISTORY = 25;

// Create React Context to share data across all screens
const DictionaryContext = createContext(null);

// Provider component that wraps the app and makes dictionary state available to all child components
export function DictionaryProvider({ children }) {
  // Current word being displayed on the detail screen
  const [wordData, setWordData] = useState(null);
  // Cache of word data keyed by lowercase word (for recent cards)
  const [wordCache, setWordCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [activeSearchWord, setActiveSearchWord] = useState(null);
  const [lastFailedWord, setLastFailedWord] = useState(null);

  // Restore search history when the app starts or is refreshed
  useEffect(() => {
    async function loadHistory() {
      try {
        const saved = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (!saved) return;

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) return;

        const words = parsed
          .filter((item) => typeof item === 'string' && item.trim())
          .slice(0, MAX_HISTORY);

        setSearchHistory(words);
      } catch {
        // Corrupt storage — start with an empty history
      } finally {
        setHistoryLoaded(true);
      }
    }

    loadHistory();
  }, []);

  // Persist history whenever it changes (after initial load)
  useEffect(() => {
    if (!historyLoaded) return;

    AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(searchHistory)).catch(
      () => {}
    );
  }, [searchHistory, historyLoaded]);

 // Add a word to the search history, ensuring no duplicates and max length of 25
  const addToHistory = useCallback((word) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setSearchHistory((prev) => {
      const lower = trimmed.toLowerCase();
      const withoutDuplicate = prev.filter((item) => item.toLowerCase() !== lower);
      return [trimmed, ...withoutDuplicate].slice(0, MAX_HISTORY);
    });
  }, []);

 // Search for a word using the dictionary API, update state with results, and handle loading/errors
  const searchWord = useCallback(
    async (word) => {
      const validation = validateSearchQuery(word);

      if (!validation.valid) {
        setError({
          type: validation.type,
          title: validation.title,
          message: validation.message,
          hint: validation.hint,
        });
        return { success: false, error: validation };
      }

      const trimmed = validation.word;

      setActiveSearchWord(trimmed);
      setWordData(null);
      setLoading(true);
      setError(null);
      setLastFailedWord(null);

      try {
        const data = await fetchWordDefinition(trimmed);
        setWordData(data);
        setWordCache((prev) => ({ ...prev, [trimmed.toLowerCase()]: data }));
        addToHistory(trimmed);
        setActiveSearchWord(null);
        return { success: true, data };
      } catch (err) {
        setWordData(null);
        setActiveSearchWord(null);
        setLastFailedWord(trimmed);
        setError({ ...err, failedWord: trimmed });
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [addToHistory]
  );

  // Clear any existing error messages
  const clearError = useCallback(() => setError(null), []);

// Clear the currently displayed word data (used when going back to home screen)
  const clearWord = useCallback(() => {
    setWordData(null);
    setActiveSearchWord(null);
  }, []);

  const retryLastSearch = useCallback(() => {
    if (lastFailedWord) {
      searchWord(lastFailedWord);
    }
  }, [lastFailedWord, searchWord]);

 // Clear search history and cached word data (used on History screen)
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    setWordCache({});
    AsyncStorage.removeItem(HISTORY_STORAGE_KEY).catch(() => {});
  }, []);

  const removeFromHistory = useCallback((word) => {
    const lower = word.trim().toLowerCase();
    if (!lower) return;

    setSearchHistory((prev) => prev.filter((item) => item.toLowerCase() !== lower));
    setWordCache((prev) => {
      const next = { ...prev };
      delete next[lower];
      return next;
    });
  }, []);

  const value = {
    wordData,
    wordCache,
    loading,
    error,
    searchHistory,
    activeSearchWord,
    lastFailedWord,
    searchWord,
    retryLastSearch,
    clearError,
    clearWord,
    clearHistory,
    removeFromHistory,
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

// Custom hook to access dictionary context values and functions in any component
export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error('useDictionary must be used inside DictionaryProvider');
  }

  return context;
}

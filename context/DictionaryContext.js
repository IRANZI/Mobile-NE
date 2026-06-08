// ============================================================
// Dictionary Context — global state for the whole app
// Manages search results, history, loading, and errors
// ============================================================

import React, { createContext, useCallback, useContext, useState } from 'react';
import { fetchWordDefinition } from '../services/dictionaryApi';

// Create React Context to share data across all screens
const DictionaryContext = createContext(null);

/**
 * Wraps the app and provides dictionary state to all child components.
 * Must wrap the app in _layout.js.
 */
export function DictionaryProvider({ children }) {
  // Current word being displayed on the detail screen
  const [wordData, setWordData] = useState(null);
  // Cache of word data keyed by lowercase word (for recent cards)
  const [wordCache, setWordCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  /**
   * Add a word to search history without duplicates.
   * Most recent word appears first. Max 25 items.
   */
  const addToHistory = useCallback((word) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setSearchHistory((prev) => {
      const lower = trimmed.toLowerCase();
      const withoutDuplicate = prev.filter((item) => item.toLowerCase() !== lower);
      return [trimmed, ...withoutDuplicate].slice(0, 25);
    });
  }, []);

  /**
   * Search for a word via the API.
   * Called from search bar, drawer history, and recent word cards.
   */
  const searchWord = useCallback(
    async (word) => {
      const trimmed = word.trim();

      if (!trimmed) {
        setError({
          type: 'validation',
          message: 'Please enter a word before searching.',
        });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchWordDefinition(trimmed);
        setWordData(data);
        // Cache word data so recent cards can show phonetics/definitions
        setWordCache((prev) => ({ ...prev, [trimmed.toLowerCase()]: data }));
        addToHistory(trimmed);
      } catch (err) {
        setWordData(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [addToHistory]
  );

  /** Clear the current error message */
  const clearError = useCallback(() => setError(null), []);

  /** Go back to home screen (hide word detail view) */
  const clearWord = useCallback(() => setWordData(null), []);

  /**
   * Clear all search history and cached word data.
   */
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    setWordCache({});
  }, []);

  const value = {
    wordData,
    wordCache,
    loading,
    error,
    searchHistory,
    searchWord,
    clearError,
    clearWord,
    clearHistory,
  };

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

/**
 * Custom hook — use inside any component to access dictionary state.
 * Example: const { searchWord, wordData } = useDictionary();
 */
export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error('useDictionary must be used inside DictionaryProvider');
  }

  return context;
}

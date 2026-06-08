// Dictionary Context

import React, { createContext, useCallback, useContext, useState } from 'react';
import { fetchWordDefinition } from '../services/dictionaryApi';
import { validateSearchQuery } from '../utils/validateSearch';

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

 // Add a word to the search history, ensuring no duplicates and max length of 25
  const addToHistory = useCallback((word) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setSearchHistory((prev) => {
      const lower = trimmed.toLowerCase();
      const withoutDuplicate = prev.filter((item) => item.toLowerCase() !== lower);
      return [trimmed, ...withoutDuplicate].slice(0, 25);
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

      setLoading(true);
      setError(null);

      try {
        const data = await fetchWordDefinition(trimmed);
        setWordData(data);
        setWordCache((prev) => ({ ...prev, [trimmed.toLowerCase()]: data }));
        addToHistory(trimmed);
        return { success: true, data };
      } catch (err) {
        setWordData(null);
        setError(err);
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
  const clearWord = useCallback(() => setWordData(null), []);

 // Clear search history and cached word data (used on History screen)
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

// Custom hook to access dictionary context values and functions in any component
export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error('useDictionary must be used inside DictionaryProvider');
  }

  return context;
}

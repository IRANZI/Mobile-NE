// ============================================================
// Dictionary API Service — HTTP requests to Free Dictionary API
// Uses axios for GET requests; works on Android and iOS
// ============================================================

import axios from 'axios';

// Base URL for the Free Dictionary API (English entries)
const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * Fetch the definition for a given English word.
 * @param {string} word - The word to look up
 * @returns {Promise<object>} First entry object from the API response array
 * @throws {object} Error object with type and message for UI display
 */
export async function fetchWordDefinition(word) {
  const url = `${BASE_URL}/${encodeURIComponent(word.trim())}`;

  try {
    const response = await axios.get(url);

    // Guard against empty or malformed API responses
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw {
        type: 'empty',
        message: 'No definition data was returned. Please try another word.',
      };
    }

    return response.data[0];
  } catch (error) {
    // Re-throw custom errors created above
    if (error.type) throw error;

    // Server returned an HTTP error status
    if (error.response) {
      if (error.response.status === 404) {
        throw {
          type: 'not_found',
          message: 'Word not found. Please check the spelling and try again.',
        };
      }
      throw {
        type: 'server',
        message: `Something went wrong (${error.response.status}). Please try again.`,
      };
    }

    // Request sent but no response received (network issue)
    if (error.request) {
      throw {
        type: 'network',
        message: 'Network error. Check your internet connection and try again.',
      };
    }

    // Any other unexpected error
    throw {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Get the first available audio pronunciation URL from phonetics array.
 * @param {Array} phonetics - Phonetics array from API response
 * @returns {string|null} Audio URL or null
 */
export function getFirstAudioUrl(phonetics) {
  const list = getAudioPhonetics(phonetics);
  return list.length > 0 ? list[0].audio : null;
}

/**
 * Collect all phonetic entries that include a playable audio URL.
 * Handles multiple pronunciations (US, UK, AU accents).
 * @param {Array} phonetics - Phonetics array from API response
 * @returns {Array<{ text, audio, label, index }>}
 */
export function getAudioPhonetics(phonetics) {
  if (!phonetics || !Array.isArray(phonetics)) return [];

  const seen = new Set();
  const results = [];

  phonetics.forEach((item, index) => {
    if (!item.audio || item.audio.trim().length === 0) return;
    if (seen.has(item.audio)) return;
    seen.add(item.audio);

    // Build a friendly label from the audio URL or phonetic text
    let label = `Accent ${results.length + 1}`;
    const url = item.audio.toLowerCase();

    if (url.includes('-us') || url.includes('_us')) label = 'US';
    else if (url.includes('-uk') || url.includes('_uk') || url.includes('-gb')) label = 'UK';
    else if (url.includes('-au')) label = 'AU';
    else if (item.text) label = item.text;

    results.push({
      text: item.text || '',
      audio: item.audio,
      label,
      index,
    });
  });

  return results;
}

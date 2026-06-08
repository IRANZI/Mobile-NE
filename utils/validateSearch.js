// User-friendly search input validation

const MAX_LENGTH = 45;
const WORD_PATTERN = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;

/**
 * Validate a dictionary search query before calling the API.
 * @param {string} input - Raw search text
 * @returns {{ valid: true, word: string } | { valid: false, type: string, title: string, message: string, hint: string }}
 */
export function validateSearchQuery(input) {
  const trimmed = (input ?? '').trim();

  if (!trimmed) {
    return {
      valid: false,
      type: 'validation',
      title: 'Almost there',
      message: 'Please type a word in the search box.',
      hint: 'Try searching for "a", "hello", or "world".',
    };
  }

  if (trimmed.length > MAX_LENGTH) {
    return {
      valid: false,
      type: 'validation',
      title: 'Too long',
      message: 'Please search for one word at a time.',
      hint: `Keep your search under ${MAX_LENGTH} characters.`,
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      valid: false,
      type: 'validation',
      title: 'One word at a time',
      message: 'Please search for a single English word.',
      hint: 'Remove spaces and try again.',
    };
  }

  if (/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      type: 'validation',
      title: 'Not a word',
      message: 'Numbers cannot be looked up in the dictionary.',
      hint: 'Try spelling it out, like "three" instead of "3".',
    };
  }

  if (/\d/.test(trimmed)) {
    return {
      valid: false,
      type: 'validation',
      title: 'Invalid word',
      message: 'Words cannot contain numbers.',
      hint: 'Use letters only, such as "book" or "read".',
    };
  }

  if (!WORD_PATTERN.test(trimmed)) {
    return {
      valid: false,
      type: 'validation',
      title: 'Invalid characters',
      message: 'Use only English letters, hyphens (-), or apostrophes (\').',
      hint: 'Remove symbols like @, #, or ! and try again.',
    };
  }

  return { valid: true, word: trimmed };
}

export const SEARCH_MAX_LENGTH = MAX_LENGTH;

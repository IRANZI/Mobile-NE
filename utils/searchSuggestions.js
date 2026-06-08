// Filter search history for autocomplete suggestions

export function getSearchSuggestions(query, history, limit = 5) {
  const q = (query ?? '').trim().toLowerCase();
  if (!q || !Array.isArray(history)) return [];

  const startsWith = [];
  const includes = [];
  const seen = new Set();

  for (const word of history) {
    if (typeof word !== 'string') continue;

    const lower = word.toLowerCase();
    if (lower === q || seen.has(lower)) continue;

    if (lower.startsWith(q)) {
      startsWith.push(word);
      seen.add(lower);
    } else if (lower.includes(q)) {
      includes.push(word);
      seen.add(lower);
    }
  }

  return [...startsWith, ...includes].slice(0, limit);
}

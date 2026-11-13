/**
 * AMEN+ Approximate / Fuzzy Search Engine
 * Supports Amharic phonetic normalization & English typo-tolerant approximate matching.
 */

/**
 * Normalizes Amharic phonetic variants and converts English to lowercase.
 */
export function normalizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    // Ha variants: ሐ (U+1210), ኀ (U+1280) -> ሀ (U+1200)
    .replace(/[ሐኀ]/g, 'ሀ')
    .replace(/[ሑኁ]/g, 'ሁ')
    .replace(/[ሒኂ]/g, 'ሂ')
    .replace(/[ሓኃ]/g, 'ሃ')
    .replace(/[ሔኄ]/g, 'ሄ')
    .replace(/[ሕኅ]/g, 'ህ')
    .replace(/[ሖኆ]/g, 'ሆ')
    .replace(/[ሗኋኇ]/g, 'ኋ')
    // Se variants: ሠ (U+1220) -> ሰ (U+1230)
    .replace(/[ሠ]/g, 'ሰ')
    .replace(/[ሡ]/g, 'ሱ')
    .replace(/[ሢ]/g, 'ሲ')
    .replace(/[ሣ]/g, 'ሳ')
    .replace(/[ሤ]/g, 'ሴ')
    .replace(/[ሥ]/g, 'ስ')
    .replace(/[ሦ]/g, 'ሶ')
    .replace(/[ሧ]/g, 'ሷ')
    // A variants: ዐ (U+12D0) -> አ (U+12A0)
    .replace(/[ዐ]/g, 'አ')
    .replace(/[ዑ]/g, 'ኡ')
    .replace(/[ዒ]/g, 'ኢ')
    .replace(/[ዓ]/g, 'ኣ')
    .replace(/[ዔ]/g, 'ኤ')
    .replace(/[ዕ]/g, 'እ')
    .replace(/[ዖ]/g, 'ኦ')
    // Tse variants: ፀ (U+1340) -> ጸ (U+1338)
    .replace(/[ፀ]/g, 'ጸ')
    .replace(/[ፁ]/g, 'ጹ')
    .replace(/[ፂ]/g, 'ጺ')
    .replace(/[ፃ]/g, 'ጻ')
    .replace(/[ፄ]/g, 'ጼ')
    .replace(/[ፅ]/g, 'ጽ')
    .replace(/[ፆ]/g, 'ጾ');
}

/**
 * Computes Levenshtein distance between two strings.
 */
export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = [];
  for (let i = 0; i <= b.length; i++) row[i] = i;

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      let val;
      if (a[i - 1] === b[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

/**
 * Evaluates whether a video approximately matches the search query.
 * Matches across title, description, and channel title.
 */
export function matchesApproximateQuery(video, query) {
  if (!query || !query.trim()) return true;

  const normQuery = normalizeText(query);
  const normTitle = normalizeText(video.title || '');
  const normDesc = normalizeText(video.description || '');
  const normChannel = normalizeText(video.channelTitle || '');
  const combined = `${normTitle} ${normDesc} ${normChannel}`;

  // 1. Direct normalized substring match
  if (combined.includes(normQuery)) return true;

  // 2. Tokenize search query and document words
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);
  if (!queryTokens.length) return true;

  const titleWords = normTitle.split(/[\s,.:;!?'"()\[\]{}\/\\|\-_]+/).filter(Boolean);
  const allWords = combined.split(/[\s,.:;!?'"()\[\]{}\/\\|\-_]+/).filter(Boolean);

  // Every token in the query must match at least one word in title/description
  return queryTokens.every((token) => {
    // Exact substring match for the token
    if (combined.includes(token)) return true;

    // Fuzzy distance tolerance based on word length
    // 4-6 chars: allows 1 typo / transposition
    // 7+ chars: allows up to 2 typos / transpositions
    const maxDistance = token.length >= 7 ? 2 : token.length >= 4 ? 1 : 0;
    if (maxDistance === 0) return false;

    // First check title words with priority
    const matchedInTitle = titleWords.some((word) => {
      if (Math.abs(word.length - token.length) > maxDistance) return false;
      return levenshteinDistance(token, word) <= maxDistance;
    });

    if (matchedInTitle) return true;

    // Then check all words
    return allWords.some((word) => {
      if (Math.abs(word.length - token.length) > maxDistance) return false;
      return levenshteinDistance(token, word) <= maxDistance;
    });
  });
}

/**
 * Filters an array of videos with approximate matching.
 */
export function filterVideos(videos, query) {
  if (!query || !query.trim()) return videos;
  return videos.filter((v) => matchesApproximateQuery(v, query));
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://amen-plus-api.onrender.com/api';

const FALLBACK_PROD_URL = 'https://amen-plus-api.onrender.com/api';

const CACHE_KEYS = {
  CHANNEL: 'amen_cache_channel_v1',
  VIDEOS_INITIAL: 'amen_cache_videos_v1'
};

const CLIENT_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Resilient API fetcher with automatic fallback to production backend.
 */
async function requestApi(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) return data;
    }
  } catch {
    // If local fetch fails, try production fallback
  }

  if (API_BASE_URL !== FALLBACK_PROD_URL) {
    try {
      const prodRes = await fetch(`${FALLBACK_PROD_URL}${endpoint}`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData && prodData.success) return prodData;
      }
    } catch {
      // Production fallback failed
    }
  }

  // Direct attempt on fallback for accurate error parsing
  const finalRes = await fetch(`${FALLBACK_PROD_URL}${endpoint}`);
  const finalData = await finalRes.json();
  if (!finalRes.ok || !finalData.success) {
    throw new Error(finalData.error?.message || `API request failed (Status ${finalRes.status})`);
  }
  return finalData;
}

/**
 * Retrieves cached initial data synchronously for fast initial opening.
 */
export function getCachedInitialData() {
  try {
    const rawChannel = sessionStorage.getItem(CACHE_KEYS.CHANNEL);
    const rawVideos = sessionStorage.getItem(CACHE_KEYS.VIDEOS_INITIAL);
    if (rawChannel && rawVideos) {
      const channelObj = JSON.parse(rawChannel);
      const videosObj = JSON.parse(rawVideos);
      const now = Date.now();
      if (
        channelObj &&
        videosObj &&
        now - channelObj.timestamp < CLIENT_CACHE_TTL &&
        now - videosObj.timestamp < CLIENT_CACHE_TTL
      ) {
        return {
          channel: channelObj.data,
          videosData: videosObj.data
        };
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

/**
 * Fetches the configured AMEN channel details with client-side caching.
 */
export async function fetchChannel() {
  const data = await requestApi('/youtube/channel');

  try {
    sessionStorage.setItem(
      CACHE_KEYS.CHANNEL,
      JSON.stringify({ data: data.data, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage quota errors
  }

  return data.data;
}

/**
 * Fetches uploaded videos with pagination support and initial page caching.
 * @param {Object} options
 * @param {string} [options.pageToken]
 * @param {number} [options.maxResults=20]
 */
export async function fetchVideos({ pageToken, maxResults = 20 } = {}) {
  const params = new URLSearchParams();
  if (maxResults) params.set('maxResults', maxResults.toString());
  if (pageToken) params.set('pageToken', pageToken);

  const data = await requestApi(`/youtube/videos?${params.toString()}`);

  const result = {
    videos: data.videos || [],
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
    pageInfo: data.pageInfo || { totalResults: 0, resultsPerPage: 0 }
  };

  // Only cache the initial batch of videos
  if (!pageToken) {
    try {
      sessionStorage.setItem(
        CACHE_KEYS.VIDEOS_INITIAL,
        JSON.stringify({ data: result, timestamp: Date.now() })
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  return result;
}

/**
 * Checks backend health.
 */
export async function checkHealth() {
  return requestApi('/health');
}

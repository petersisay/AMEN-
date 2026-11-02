const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetches the configured AMEN channel details.
 */
export async function fetchChannel() {
  const response = await fetch(`${API_BASE_URL}/youtube/channel`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || `Failed to fetch channel details (Status ${response.status})`);
  }

  return data.data;
}

/**
 * Fetches uploaded videos with pagination support.
 * @param {Object} options
 * @param {string} [options.pageToken]
 * @param {number} [options.maxResults=50]
 */
export async function fetchVideos({ pageToken, maxResults = 50 } = {}) {
  const params = new URLSearchParams();
  if (maxResults) params.set('maxResults', maxResults.toString());
  if (pageToken) params.set('pageToken', pageToken);

  const response = await fetch(`${API_BASE_URL}/youtube/videos?${params.toString()}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || `Failed to fetch videos (Status ${response.status})`);
  }

  return {
    videos: data.videos || [],
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
    pageInfo: data.pageInfo || { totalResults: 0, resultsPerPage: 0 }
  };
}

/**
 * Checks backend health.
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}

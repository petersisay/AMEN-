const config = require('../config/youtube');

/**
 * Sanitizes URLs or error strings to prevent leaking the API key.
 */
function sanitizeMessage(message) {
  if (!message || typeof message !== 'string') return message;
  return message.replace(/key=[^&\s]+/gi, 'key=[REDACTED]');
}

/**
 * Validates that the YouTube API key is configured.
 */
function validateApiKey() {
  if (!config.apiKey) {
    const error = new Error('YouTube API key is not configured in server/.env');
    error.statusCode = 500;
    error.code = 'API_KEY_MISSING';
    throw error;
  }
}

/**
 * Validates that the YouTube channel ID is configured.
 */
function validateChannelId() {
  if (!config.channelId) {
    const error = new Error('YouTube Channel ID is not configured in server/.env');
    error.statusCode = 500;
    error.code = 'CHANNEL_ID_MISSING';
    throw error;
  }
}

/**
 * Validates that the YouTube uploads playlist ID is configured.
 */
function validateUploadsPlaylistId() {
  if (!config.uploadsPlaylistId) {
    const error = new Error('YouTube Uploads Playlist ID is not configured in server/.env');
    error.statusCode = 500;
    error.code = 'PLAYLIST_ID_MISSING';
    throw error;
  }
}

/**
 * Helper to fetch from YouTube API and safely parse errors.
 */
async function fetchFromYouTube(endpoint, params = {}) {
  validateApiKey();

  const url = new URL(`${config.apiUrl}/${endpoint}`);
  url.searchParams.set('key', config.apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  }

  let response;
  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
  } catch (networkError) {
    const safeError = new Error(`Network failure while connecting to YouTube API: ${sanitizeMessage(networkError.message)}`);
    safeError.statusCode = 502;
    safeError.code = 'NETWORK_ERROR';
    throw safeError;
  }

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON response
    }

    const apiError = errorData?.error;
    const rawMessage = apiError?.message || `YouTube API returned status ${response.status}`;
    const safeMessage = sanitizeMessage(rawMessage);
    const reason = apiError?.errors?.[0]?.reason || 'API_ERROR';

    const err = new Error(safeMessage);
    err.statusCode = response.status;
    err.code = reason;
    throw err;
  }

  return response.json();
}

/**
 * Retrieves AMEN channel information.
 */
async function getChannel() {
  validateChannelId();

  const data = await fetchFromYouTube('channels', {
    part: 'snippet,contentDetails,statistics',
    id: config.channelId
  });

  const channelItem = data.items?.[0];
  if (!channelItem) {
    const error = new Error(`Channel with ID ${config.channelId} not found`);
    error.statusCode = 404;
    error.code = 'CHANNEL_NOT_FOUND';
    throw error;
  }

  return {
    id: channelItem.id,
    title: channelItem.snippet?.title || '',
    description: channelItem.snippet?.description || '',
    customUrl: channelItem.snippet?.customUrl || '',
    publishedAt: channelItem.snippet?.publishedAt || '',
    thumbnails: channelItem.snippet?.thumbnails || {},
    statistics: {
      viewCount: channelItem.statistics?.viewCount || '0',
      subscriberCount: channelItem.statistics?.subscriberCount || '0',
      videoCount: channelItem.statistics?.videoCount || '0'
    },
    uploadsPlaylistId: channelItem.contentDetails?.relatedPlaylists?.uploads || config.uploadsPlaylistId
  };
}

/**
 * Retrieves uploaded videos from the AMEN channel uploads playlist.
 */
async function getVideos({ pageToken, maxResults = 50 } = {}) {
  validateUploadsPlaylistId();

  const parsedLimit = Math.min(Math.max(parseInt(maxResults, 10) || 50, 1), 50);

  const params = {
    part: 'snippet,contentDetails',
    playlistId: config.uploadsPlaylistId,
    maxResults: parsedLimit
  };

  if (pageToken && typeof pageToken === 'string' && pageToken.trim() !== '') {
    params.pageToken = pageToken.trim();
  }

  const data = await fetchFromYouTube('playlistItems', params);

  const videos = (data.items || [])
    .map(item => {
      const snippet = item.snippet || {};
      const contentDetails = item.contentDetails || {};
      const videoId = snippet.resourceId?.videoId || contentDetails.videoId;

      return {
        id: videoId,
        title: snippet.title || '',
        description: snippet.description || '',
        thumbnails: snippet.thumbnails || {},
        publishedAt: snippet.publishedAt || contentDetails.videoPublishedAt || '',
        channelTitle: snippet.channelTitle || '',
        playlistId: snippet.playlistId || ''
      };
    })
    .filter(v => v.id && v.title !== 'Private video' && v.title !== 'Deleted video');

  return {
    videos,
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
    pageInfo: {
      totalResults: data.pageInfo?.totalResults ?? videos.length,
      resultsPerPage: data.pageInfo?.resultsPerPage ?? videos.length
    }
  };
}

module.exports = {
  getChannel,
  getVideos,
  sanitizeMessage
};

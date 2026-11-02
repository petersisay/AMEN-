require('dotenv').config();

const youtubeConfig = {
  apiKey: (process.env.YOUTUBE_API_KEY || '').trim(),
  channelId: (process.env.YOUTUBE_CHANNEL_ID || 'UCGWqiRHa7VqmPfIiCJcW4lw').trim(),
  uploadsPlaylistId: (process.env.YOUTUBE_UPLOADS_PLAYLIST_ID || 'UUGWqiRHa7VqmPfIiCJcW4lw').trim(),
  apiUrl: 'https://www.googleapis.com/youtube/v3',
};

module.exports = youtubeConfig;

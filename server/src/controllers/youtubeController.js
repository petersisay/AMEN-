const youtubeService = require('../services/youtubeService');

/**
 * Controller to get AMEN channel information.
 */
async function getChannel(req, res) {
  try {
    const channel = await youtubeService.getChannel();
    return res.status(200).json({
      success: true,
      data: channel
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: youtubeService.sanitizeMessage(err.message)
      }
    });
  }
}

/**
 * Controller to get uploaded videos from AMEN channel.
 */
async function getVideos(req, res) {
  try {
    const { pageToken, maxResults } = req.query;

    if (maxResults !== undefined) {
      const parsed = parseInt(maxResults, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 50) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PARAMETER',
            message: 'maxResults must be an integer between 1 and 50.'
          }
        });
      }
    }

    const result = await youtubeService.getVideos({
      pageToken,
      maxResults
    });

    return res.status(200).json({
      success: true,
      videos: result.videos,
      nextPageToken: result.nextPageToken,
      prevPageToken: result.prevPageToken,
      pageInfo: result.pageInfo
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: youtubeService.sanitizeMessage(err.message)
      }
    });
  }
}

module.exports = {
  getChannel,
  getVideos
};

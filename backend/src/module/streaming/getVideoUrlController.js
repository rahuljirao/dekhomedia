const { responsecodes } = require("../../response-codes/lib");
const { db } = require("../../common/db");
const utils = require("../../common/utils");
const { getStatusText } = require("../../response-codes/responseCode");
const videoTokenService = require("../../services/videoTokenService");

class GetVideoUrlController {

  /**
   * Check if URL is from internal server (environment-aware)
   * - On local: Only localhost URLs are internal
   * - On live: Only api-dramashort.ukosoft.store URLs are internal
   */
  static isInternalServerUrl(url) {
    if (!url) return false;

    // Relative paths are always internal
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return true;
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5010/';
    const isLocalEnvironment = baseUrl.includes('localhost');

    if (isLocalEnvironment) {
      // Running on local - only localhost URLs are internal
      if (url.includes('localhost:5010') || url.includes('localhost')) {
        return true;
      }
    } else {
      // Running on live/production - only production domain URLs are internal
      if (url.includes('api-dramashort.ukosoft.store')) {
        return true;
      }
    }

    return false;
  }

  static async getVideoUrl(req, res) {
    const request = req.body;
    let authorizer = await utils.getAdvertiserDetails(req);

    try {
      // Validate input
      if (request.episode_id === undefined || request.episode_id === null) {
        return res.status(400).send({
          responseCode: responsecodes().ID_REQUIRED,
          responseMessage: getStatusText(responsecodes().ID_REQUIRED),
          responseData: {}
        });
      }

      const userId = authorizer.id;
      const episodeId = parseInt(request.episode_id);
      const seriesId = request.series_id;

      // Special case: episode_id = 0 means cover video
      if (episodeId === 0) {
        if (!seriesId) {
          return res.status(400).send({
            responseCode: responsecodes().INVALID_REQUEST,
            responseMessage: 'Series ID is required for cover video',
            responseData: {}
          });
        }

        // Get series cover video
        const [series] = await db.query(
          'SELECT id, title, cover_video FROM series WHERE id = ? AND is_deleted = 0',
          [seriesId]
        );

        if (series.length === 0 || !series[0].cover_video) {
          return res.status(404).send({
            responseCode: responsecodes().NOT_FOUND,
            responseMessage: 'Cover video not found',
            responseData: {}
          });
        }

        const coverVideo = series[0].cover_video;

        // Check if cover video is on internal servers or external
        const isExternal = coverVideo &&
                           (coverVideo.startsWith('http://') || coverVideo.startsWith('https://')) &&
                           !GetVideoUrlController.isInternalServerUrl(coverVideo);

        // Cover videos are always accessible (no access check needed)
        // Generate token for tracking
        const ipAddress = req.headers['x-forwarded-for'] ||
                          req.headers['x-real-ip'] ||
                          req.connection?.remoteAddress ||
                          'unknown';
        const deviceId = request.device_id || 'web';

        const tokenData = await videoTokenService.generateToken(
          userId,
          0, // episode_id = 0 for cover video
          seriesId,
          ipAddress,
          deviceId
        );

        if (isExternal) {
          return res.send({
            responseCode: responsecodes().SUCCESS_OK,
            responseMessage: 'Cover video URL retrieved successfully',
            responseData: {
              videoType: 'external',
              videoUrl: coverVideo,
              token: tokenData.token,
              expiresIn: tokenData.expiresIn,
              expiresAt: tokenData.expiresAt,
              playbackType: coverVideo.includes('.m3u8') ? 'hls' : 'direct',
              isCoverVideo: true
            }
          });
        } else {
          const baseUrl = process.env.BASE_URL || 'http://localhost:5010/';
          const streamUrl = `${baseUrl}stream/play/0?token=${tokenData.token}&series_id=${seriesId}`;

          return res.send({
            responseCode: responsecodes().SUCCESS_OK,
            responseMessage: 'Cover video URL retrieved successfully',
            responseData: {
              videoType: 'hosted',
              videoUrl: streamUrl,
              token: tokenData.token,
              expiresIn: tokenData.expiresIn,
              expiresAt: tokenData.expiresAt,
              playbackType: 'hls',
              isCoverVideo: true
            }
          });
        }
      }

      // Regular episode handling
      // Get episode details using series_id and episode_number
      const [episodes] = await db.query(
        'SELECT * FROM series_episodes WHERE series_id = ? AND episode_number = ? AND is_deleted = 0',
        [seriesId, episodeId]
      );

      if (episodes.length === 0) {
        return res.status(404).send({
          responseCode: responsecodes().NOT_FOUND,
          responseMessage: `Episode not found: series ${seriesId}, episode ${episodeId}`,
          responseData: {}
        });
      }

      const episode = episodes[0];

      // Check if user has access to this episode (episodeId is episode_number)
      const hasAccess = await GetVideoUrlController.checkEpisodeAccess(userId, episodeId, seriesId);

      if (!hasAccess.allowed) {
        return res.status(403).send({
          responseCode: responsecodes().UNAUTHORIZED,
          responseMessage: hasAccess.message,
          responseData: {}
        });
      }

      // Get client IP and device ID
      const ipAddress = req.headers['x-forwarded-for'] ||
                        req.headers['x-real-ip'] ||
                        req.connection?.remoteAddress ||
                        'unknown';
      const deviceId = request.device_id || 'web';

      // Generate access token
      const tokenData = await videoTokenService.generateToken(
        userId,
        episodeId,
        seriesId,
        ipAddress,
        deviceId
      );

      const baseUrl = process.env.BASE_URL || 'http://localhost:5010/';

      // Check if video is hosted on internal servers or external
      const isExternal = episode.video_url &&
                         (episode.video_url.startsWith('http://') || episode.video_url.startsWith('https://')) &&
                         !GetVideoUrlController.isInternalServerUrl(episode.video_url);

      if (isExternal) {
        // External URL from other servers: Return direct URL for HLS player
        // If external URL is already m3u8, return it directly
        // If it's MP4, return it for direct playback
        return res.send({
          responseCode: responsecodes().SUCCESS_OK,
          responseMessage: 'Video URL retrieved successfully',
          responseData: {
            videoType: 'external',
            videoUrl: episode.video_url,
            token: tokenData.token,
            expiresIn: tokenData.expiresIn,
            expiresAt: tokenData.expiresAt,
            playbackType: episode.video_url.includes('.m3u8') ? 'hls' : 'direct'
          }
        });
      } else {
        // Internal server video (uploaded or from our servers): Convert to HLS
        const streamUrl = `${baseUrl}stream/play/${episodeId}?token=${tokenData.token}`;

        return res.send({
          responseCode: responsecodes().SUCCESS_OK,
          responseMessage: 'Video URL retrieved successfully',
          responseData: {
            videoType: 'hosted',
            videoUrl: streamUrl,
            token: tokenData.token,
            expiresIn: tokenData.expiresIn,
            expiresAt: tokenData.expiresAt,
            playbackType: 'hls'
          }
        });
      }

    } catch (err) {
      console.log("Error in getVideoUrl:", err);
      return res.status(400).send(await utils.throwCatchError(err));
    }
  }

  /**
   * Check if user has access to episode
   * @param {number} episodeNumber - The episode number (not the auto-increment id)
   * @param {number} seriesId - The series ID
   */
  static async checkEpisodeAccess(userId, episodeNumber, seriesId) {
    // Get user details
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return { allowed: false, message: 'User not found' };
    }
    const user = users[0];

    // Get episode details using series_id and episode_number
    const [episodes] = await db.query(
      `SELECT se.*, s.free_episodes, s.is_free
       FROM series_episodes se
       JOIN series s ON se.series_id = s.id
       WHERE se.series_id = ? AND se.episode_number = ?`,
      [seriesId, episodeNumber]
    );

    if (episodes.length === 0) {
      return { allowed: false, message: 'Episode not found' };
    }
    const episode = episodes[0];

    // Check if user is VIP
    const now = new Date();
    const isWeeklyVIP = user.is_weekly_vip && new Date(user.weekly_vip_ended) > now;
    const isYearlyVIP = user.is_yearly_vip && new Date(user.yearly_vip_ended) > now;
    const isMonthlyVIP = user.is_monthly_vip && new Date(user.monthly_vip_ended) > now;

    if (isWeeklyVIP || isYearlyVIP || isMonthlyVIP) {
      return { allowed: true, message: 'VIP access' };
    }

    // Check if episode is free
    if ((episode.episode_number <= episode.free_episodes) || episode.is_free) {
      return { allowed: true, message: 'Free episode' };
    }

    // Check if user unlocked this episode (episode_unlocked table uses the auto-increment id)
    const [unlocked] = await db.query(
      'SELECT * FROM episode_unlocked WHERE user_id = ? AND series_id = ? AND episode_id = ?',
      [userId, episode.series_id, episode.episode_number]
    );

    if (unlocked.length > 0) {
      return { allowed: true, message: 'Episode unlocked' };
    }

    return {
      allowed: false,
      message: 'Episode not unlocked. Please unlock with coins or purchase VIP.'
    };
  }
}

module.exports = GetVideoUrlController;

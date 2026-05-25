const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { db } = require('../common/db');

class OnDemandHLSService {

  /**
   * Check if URL is from internal server (environment-aware)
   */
  isInternalServerUrl(url) {
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

  constructor() {
    this.hlsBasePath = path.join(process.cwd(), 'uploads', 'hls');

    // Ensure HLS directory exists
    if (!fs.existsSync(this.hlsBasePath)) {
      fs.mkdirSync(this.hlsBasePath, { recursive: true });
    }
  }

  /**
   * Ensure HLS exists for a video - generate on-demand if not exists
   * @param {number} episodeNumber - The episode number (not the auto-increment id)
   * @param {number} seriesId - The series ID
   */
  async ensureHlsForEpisode(episodeNumber, seriesId) {
    const cacheKey = `s${seriesId}_ep${episodeNumber}`;
    const episodeDir = path.join(this.hlsBasePath, cacheKey);
    const playlistPath = path.join(episodeDir, 'index.m3u8');

    // Check if HLS already exists
    if (fs.existsSync(playlistPath)) {
      console.log(`✅ HLS already exists for series ${seriesId} episode ${episodeNumber}`);
      await this.updateAccessStats(episodeNumber, seriesId);
      return {
        exists: true,
        playlistPath,
        relativePath: `hls/${cacheKey}/index.m3u8`
      };
    }

    // Get episode details using series_id and episode_number
    const [episodes] = await db.query(
      'SELECT * FROM series_episodes WHERE series_id = ? AND episode_number = ? AND is_deleted = 0',
      [seriesId, episodeNumber]
    );

    if (episodes.length === 0) {
      throw new Error(`Episode not found: series ${seriesId}, episode ${episodeNumber}`);
    }

    const episode = episodes[0];

    // Check if video URL is external (not from our servers)
    const isInternalUrl = this.isInternalServerUrl(episode.video_url);

    // Only convert videos from our own servers (not external URLs)
    if (!isInternalUrl) {
      console.log(`📺 Series ${seriesId} Episode ${episodeNumber} uses external URL, skipping conversion`);
      return {
        exists: false,
        isExternal: true,
        externalUrl: episode.video_url
      };
    }

    // Get video file path - handle both full URLs and relative paths
    let inputPath;
    if (episode.video_url.startsWith('http://') || episode.video_url.startsWith('https://')) {
      // Extract path from full URL
      const url = new URL(episode.video_url);
      inputPath = path.join(process.cwd(), url.pathname.replace(/^\//, ''));
    } else {
      // Relative path
      const videoFileName = path.basename(episode.video_url);
      inputPath = path.join(process.cwd(), 'uploads', 'episode', 'videos', videoFileName);
    }

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Video file not found: ${inputPath}`);
    }

    console.log(`🎬 Starting HLS conversion for series ${seriesId} episode ${episodeNumber}...`);

    // Update status to processing (optional - ignore if columns don't exist)
    try {
      await db.query(
        'UPDATE series_episodes SET hls_cache_status = ? WHERE series_id = ? AND episode_number = ?',
        ['processing', seriesId, episodeNumber]
      );
    } catch (err) {
      console.log('Note: hls_cache_status column not found, skipping status update');
    }

    // Create episode directory
    fs.mkdirSync(episodeDir, { recursive: true });

    // Generate HLS
    await this.convertToHLS(inputPath, episodeDir, cacheKey);

    // Update database (optional - ignore if columns don't exist)
    try {
      await db.query(
        `UPDATE series_episodes
         SET hls_cache_status = ?,
             hls_cache_path = ?,
             hls_last_accessed = NOW(),
             hls_access_count = 1
         WHERE series_id = ? AND episode_number = ?`,
        ['completed', `hls/${cacheKey}/index.m3u8`, seriesId, episodeNumber]
      );
    } catch (err) {
      console.log('Note: HLS tracking columns not found, skipping database update');
    }

    console.log(`✅ HLS conversion completed for series ${seriesId} episode ${episodeNumber}`);

    return {
      exists: true,
      playlistPath,
      relativePath: `hls/${cacheKey}/index.m3u8`
    };
  }

  /**
   * Convert video to HLS format using FFmpeg
   * @param {string} cacheKey - Cache key for logging (e.g. "s1_ep1")
   */
  convertToHLS(inputPath, outputDir, cacheKey) {
    return new Promise((resolve, reject) => {
      const playlistPath = path.join(outputDir, 'index.m3u8');
      const segmentPattern = path.join(outputDir, 'seg_%05d.ts');

      ffmpeg(inputPath)
        .output(playlistPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('hls')
        .outputOptions([
          '-preset veryfast',      // Fast encoding
          '-g 48',                 // GOP size
          '-sc_threshold 0',       // Scene change threshold
          '-hls_time 6',           // 6 second segments
          '-hls_list_size 0',      // Keep all segments in playlist
          '-hls_segment_type mpegts',
          `-hls_segment_filename ${segmentPattern}`,
        ])
        .on('start', (cmd) => {
          console.log(`FFmpeg command for ${cacheKey}:`, cmd);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Processing ${cacheKey}: ${Math.floor(progress.percent)}% done`);
          }
        })
        .on('error', (err) => {
          console.error(`❌ FFmpeg error for ${cacheKey}:`, err);
          reject(err);
        })
        .on('end', () => {
          console.log(`✅ FFmpeg conversion finished for ${cacheKey}`);
          resolve();
        })
        .run();
    });
  }

  /**
   * Update access statistics (optional - gracefully handle missing columns)
   */
  async updateAccessStats(episodeNumber, seriesId) {
    try {
      await db.query(
        `UPDATE series_episodes
         SET hls_last_accessed = NOW(),
             hls_access_count = hls_access_count + 1
         WHERE series_id = ? AND episode_number = ?`,
        [seriesId, episodeNumber]
      );
    } catch (err) {
      // Columns don't exist, skip update
      console.log('Note: HLS access tracking columns not found, skipping stats update');
    }
  }

  /**
   * Get HLS playlist path
   */
  getPlaylistPath(episodeNumber, seriesId) {
    const cacheKey = `s${seriesId}_ep${episodeNumber}`;
    return path.join(this.hlsBasePath, cacheKey, 'index.m3u8');
  }

  /**
   * Get segment path
   */
  getSegmentPath(episodeNumber, seriesId, segmentFile) {
    const cacheKey = `s${seriesId}_ep${episodeNumber}`;
    return path.join(this.hlsBasePath, cacheKey, segmentFile);
  }

  /**
   * Clean old HLS cache (optional - for maintenance)
   */
  async cleanOldCache(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const [rows] = await db.query(
      `SELECT id, hls_cache_path FROM series_episodes
       WHERE hls_last_accessed < ?
       AND hls_cache_status = 'completed'
       AND video_source = 'uploaded'`,
      [cutoffDate]
    );

    for (const row of rows) {
      const episodeDir = path.join(this.hlsBasePath, `episode_${row.id}`);

      try {
        if (fs.existsSync(episodeDir)) {
          fs.rmSync(episodeDir, { recursive: true, force: true });
          console.log(`🗑️ Cleaned HLS cache for episode ${row.id}`);
        }

        await db.query(
          `UPDATE series_episodes
           SET hls_cache_status = 'not_started', hls_cache_path = NULL
           WHERE id = ?`,
          [row.id]
        );
      } catch (error) {
        console.error(`Error cleaning cache for episode ${row.id}:`, error);
      }
    }

    console.log(`Cleaned ${rows.length} old HLS caches`);
  }
}

module.exports = new OnDemandHLSService();

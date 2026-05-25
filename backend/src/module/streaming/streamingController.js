const fs = require('fs');
const path = require('path');
const { db } = require('../../common/db');
const onDemandHLSService = require('../../services/onDemandHLSService');
const videoTokenService = require('../../services/videoTokenService');

class StreamingController {

  /**
   * Serve HLS master playlist (generates HLS on-demand if needed)
   */
  static async serveMasterPlaylist(req, res) {
    try {
      const { episodeId } = req.params;
      const token = req.query.token;
      const seriesIdParam = req.query.series_id; // For episode 0 (cover video)

      console.log('🎬 serveMasterPlaylist called for episode:', episodeId);
      console.log('🔑 Token received:', token ? 'Yes' : 'No');
      console.log('📺 Series ID from query:', seriesIdParam);

      if (!token) {
        return res.status(403).send('Token is required');
      }

      // Validate token
      const validation = await videoTokenService.validateToken(
        token,
        req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress
      );

      console.log('✅ Token validation result:', validation);

      if (!validation.valid) {
        console.log('❌ Token validation failed:', validation.error);
        return res.status(403).send(validation.error || 'Access denied');
      }

      // Verify episode ID matches token
      if (parseInt(validation.episodeId) !== parseInt(episodeId)) {
        console.log('❌ Episode ID mismatch. Token:', validation.episodeId, 'Requested:', episodeId);
        return res.status(403).send('Token not valid for this episode');
      }

      console.log('✅ Token validated successfully for episode:', episodeId);

      // Special handling for episode 0 (cover video/trailer)
      if (parseInt(episodeId) === 0) {
        console.log('📺 Episode 0 detected - fetching cover video from series table');

        const seriesId = seriesIdParam || validation.seriesId;
        if (!seriesId) {
          return res.status(400).send('Series ID is required for cover video');
        }

        // Get series cover video
        const [series] = await db.query(
          'SELECT id, title, cover_video FROM series WHERE id = ? AND is_deleted = 0',
          [seriesId]
        );

        if (series.length === 0 || !series[0].cover_video) {
          return res.status(404).send('Cover video not found');
        }

        // For cover video, we need to treat it like a regular video
        // Create a temporary episode object for HLS processing
        const coverVideoPath = series[0].cover_video;

        // Check if it's an external URL
        if (coverVideoPath &&
            (coverVideoPath.startsWith('http://') || coverVideoPath.startsWith('https://')) &&
            !onDemandHLSService.isInternalServerUrl(coverVideoPath)) {
          return res.status(400).send('Cover video uses external URL. Play directly.');
        }

        // Try to get/generate HLS for cover video
        // We'll use a special cache key for cover videos
        const cacheKey = `s${seriesId}_cover`;
        const episodeDir = path.join(onDemandHLSService.hlsBasePath, cacheKey);
        const playlistPath = path.join(episodeDir, 'index.m3u8');

        if (!fs.existsSync(playlistPath)) {
          // Need to generate HLS for cover video
          console.log('🎬 Generating HLS for cover video...');

          let inputPath;
          if (coverVideoPath.startsWith('http://') || coverVideoPath.startsWith('https://')) {
            const url = new URL(coverVideoPath);
            inputPath = path.join(process.cwd(), url.pathname.replace(/^\//, ''));
          } else {
            const videoFileName = path.basename(coverVideoPath);
            inputPath = path.join(process.cwd(), 'uploads', 'series', 'videos', videoFileName);
          }

          if (!fs.existsSync(inputPath)) {
            return res.status(404).send('Cover video file not found');
          }

          // Create directory and convert
          fs.mkdirSync(episodeDir, { recursive: true });
          await onDemandHLSService.convertToHLS(inputPath, episodeDir, cacheKey);
        }

        // Read and serve playlist
        let playlistContent = fs.readFileSync(playlistPath, 'utf8');

        // Rewrite segment paths to include token
        playlistContent = playlistContent
          .split('\n')
          .map((line) => {
            if (line.trim().endsWith('.ts')) {
              const segmentFile = line.trim();
              return `/stream/segment/${token}/0/${segmentFile}`;
            }
            return line;
          })
          .join('\n');

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

        return res.send(playlistContent);
      }

      // Regular episode handling
      // Ensure HLS exists (generate on-demand if not)
      // episodeId here is actually episode_number, and we get seriesId from token
      const hlsResult = await onDemandHLSService.ensureHlsForEpisode(
        parseInt(episodeId),
        validation.seriesId
      );

      if (hlsResult.isExternal) {
        return res.status(400).send('This episode uses an external URL. Play directly.');
      }

      if (!hlsResult.exists) {
        return res.status(500).send('Failed to generate HLS stream');
      }

      // Read playlist file
      const playlistPath = hlsResult.playlistPath;
      if (!fs.existsSync(playlistPath)) {
        return res.status(404).send('Playlist not found');
      }

      // Read and rewrite playlist to include token in segment URLs
      let playlistContent = fs.readFileSync(playlistPath, 'utf8');

      // Rewrite segment paths to include token
      playlistContent = playlistContent
        .split('\n')
        .map((line) => {
          if (line.trim().endsWith('.ts')) {
            const segmentFile = line.trim();
            return `/stream/segment/${token}/${episodeId}/${segmentFile}`;
          }
          return line;
        })
        .join('\n');

      // Set headers
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

      res.send(playlistContent);

    } catch (error) {
      console.error('❌ Error serving master playlist:', error);
      res.status(500).send('Failed to stream video: ' + error.message);
    }
  }

  /**
   * Serve HLS segment with token validation
   */
  static async serveSegment(req, res) {
    try {
      const { token, episodeId, segmentFile } = req.params;

      // Validate token
      const validation = await videoTokenService.validateToken(
        token,
        req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress
      );

      if (!validation.valid) {
        return res.status(403).send(validation.error || 'Access denied');
      }

      // Verify episode ID matches token
      if (parseInt(validation.episodeId) !== parseInt(episodeId)) {
        return res.status(403).send('Token not valid for this episode');
      }

      let segmentPath;

      // Special handling for episode 0 (cover video)
      if (parseInt(episodeId) === 0) {
        const cacheKey = `s${validation.seriesId}_cover`;
        segmentPath = path.join(onDemandHLSService.hlsBasePath, cacheKey, segmentFile);
      } else {
        // Get segment path (episodeId is actually episode_number)
        segmentPath = onDemandHLSService.getSegmentPath(
          parseInt(episodeId),
          validation.seriesId,
          segmentFile
        );
      }

      if (!fs.existsSync(segmentPath)) {
        console.error('❌ Segment not found:', segmentPath);
        return res.status(404).send('Segment not found');
      }

      // Set headers for video segment
      res.setHeader('Content-Type', 'video/mp2t');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Segments can be cached long-term
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Stream the segment
      const stream = fs.createReadStream(segmentPath);
      stream.pipe(res);

    } catch (error) {
      console.error('❌ Error serving segment:', error);
      res.status(500).send('Failed to serve segment');
    }
  }
}

module.exports = StreamingController;

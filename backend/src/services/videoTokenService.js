const jwt = require('jsonwebtoken');
const { db } = require('../common/db');

class VideoTokenService {

  constructor() {
    this.tokenSecret = process.env.VIDEO_TOKEN_SECRET || 'your-video-secret-key-change-in-production';
    this.tokenExpiration = process.env.VIDEO_TOKEN_EXPIRATION || '3h'; // 3 hours
  }

  /**
   * Generate video access token
   */
  async generateToken(userId, episodeId, seriesId, ipAddress = null, deviceId = null) {
    // Create JWT payload
    const payload = {
      userId: parseInt(userId),
      episodeId: parseInt(episodeId),
      seriesId: parseInt(seriesId),
      iat: Math.floor(Date.now() / 1000)
    };

    // Generate JWT token
    const token = jwt.sign(payload, this.tokenSecret, {
      expiresIn: this.tokenExpiration
    });

    // Calculate expiration date
    const expiresIn = this.parseExpiration(this.tokenExpiration);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Store in database for tracking (optional but useful for analytics)
    try {
      await db.query(
        `INSERT INTO video_access_tokens
         (token, user_id, episode_id, series_id, ip_address, device_id, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [token, userId, episodeId, seriesId, ipAddress, deviceId, expiresAt]
      );
    } catch (error) {
      // If table doesn't exist yet, just continue (token still works via JWT)
      console.log('Note: video_access_tokens table not found, using JWT only');
    }

    return {
      token,
      expiresIn,
      expiresAt
    };
  }

  /**
   * Validate video access token
   */
  async validateToken(token, ipAddress = null) {
    try {
      console.log('🔐 Validating token with secret:', this.tokenSecret.substring(0, 10) + '...');
      console.log('📝 Token to validate:', token ? token.substring(0, 50) + '...' : 'null');

      // Verify JWT
      const decoded = jwt.verify(token, this.tokenSecret);
      console.log('✅ Token decoded successfully:', decoded);

      // Optional: Check IP address validation
      if (process.env.ENABLE_IP_VALIDATION === 'true' && ipAddress) {
        try {
          const [rows] = await db.query(
            'SELECT ip_address FROM video_access_tokens WHERE token = ? AND is_revoked = 0',
            [token]
          );

          if (rows.length > 0 && rows[0].ip_address !== ipAddress) {
            return {
              valid: false,
              error: 'IP address mismatch'
            };
          }
        } catch (error) {
          // Table doesn't exist, skip IP validation
        }
      }

      // Update access count
      try {
        await db.query(
          `UPDATE video_access_tokens
           SET access_count = access_count + 1, last_accessed_at = NOW()
           WHERE token = ?`,
          [token]
        );
      } catch (error) {
        // Ignore if table doesn't exist
      }

      return {
        valid: true,
        userId: decoded.userId,
        episodeId: decoded.episodeId,
        seriesId: decoded.seriesId
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          valid: false,
          error: 'Token expired'
        };
      }

      return {
        valid: false,
        error: 'Invalid token'
      };
    }
  }

  /**
   * Revoke a token
   */
  async revokeToken(token) {
    try {
      await db.query(
        'UPDATE video_access_tokens SET is_revoked = 1 WHERE token = ?',
        [token]
      );
      return true;
    } catch (error) {
      console.error('Error revoking token:', error);
      return false;
    }
  }

  /**
   * Clean expired tokens (run as cron job)
   */
  async cleanExpiredTokens() {
    try {
      const result = await db.query(
        'DELETE FROM video_access_tokens WHERE expires_at < NOW()'
      );
      console.log(`🗑️ Cleaned ${result[0].affectedRows} expired video tokens`);
      return result[0].affectedRows;
    } catch (error) {
      console.error('Error cleaning expired tokens:', error);
      return 0;
    }
  }

  /**
   * Parse expiration string to seconds
   */
  parseExpiration(exp) {
    if (typeof exp === 'number') return exp;

    const match = exp.match(/^(\d+)([smhd])$/);
    if (!match) return 10800; // Default 3 hours

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 10800;
    }
  }
}

module.exports = new VideoTokenService();

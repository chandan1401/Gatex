const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const logger = require('../utils/logger');
const { getRedisClient } = require('../config/redis');
const ApiResponse = require('../utils/responseFormatter');

const redis = getRedisClient();

class AuthService {
  async generateTokenPair(payload) {
    try {
      const accessToken = jwt.generateToken(payload);
      const refreshToken = jwt.generateToken(payload, true);

      // Store refresh token in Redis
      const refreshTokenKey = `refresh-token:${payload.userId}`;
      await redis.setex(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken); // 7 days

      return {
        accessToken,
        refreshToken,
        expiresIn: '24h',
      };
    } catch (error) {
      logger.error('Token generation error:', error);
      throw error;
    }
  }

  async verifyAccessToken(token) {
    try {
      return jwt.verifyToken(token);
    } catch (error) {
      logger.warn('Access token verification failed:', error.message);
      throw error;
    }
  }

  async refreshAccessToken(userId, refreshToken) {
    try {
      // Verify refresh token structure
      const decoded = jwt.verifyToken(refreshToken, true);

      if (decoded.userId !== userId) {
        throw new Error('Token mismatch');
      }

      // Check if token exists in Redis
      const refreshTokenKey = `refresh-token:${userId}`;
      const storedToken = await redis.get(refreshTokenKey);

      if (storedToken !== refreshToken) {
        throw new Error('Refresh token invalid or revoked');
      }

      // Generate new access token
      const newAccessToken = jwt.generateToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });

      return {
        accessToken: newAccessToken,
        expiresIn: '24h',
      };
    } catch (error) {
      logger.warn('Token refresh failed:', error.message);
      throw error;
    }
  }

  async revokeRefreshToken(userId) {
    try {
      const refreshTokenKey = `refresh-token:${userId}`;
      await redis.del(refreshTokenKey);
      logger.info('Refresh token revoked:', { userId });
    } catch (error) {
      logger.error('Token revocation error:', error);
      throw error;
    }
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  async validateCredentials(email, password, userRecord) {
    if (!userRecord) {
      logger.warn('User not found:', { email });
      return false;
    }

    const isValid = await this.comparePassword(password, userRecord.password);

    if (!isValid) {
      logger.warn('Invalid password attempt:', { email });
    }

    return isValid;
  }

  async blockUser(userId, reason = 'Suspicious activity') {
    try {
      const blockKey = `blocked-user:${userId}`;
      await redis.setex(blockKey, 24 * 60 * 60, reason); // 24 hours
      logger.warn('User blocked:', { userId, reason });
    } catch (error) {
      logger.error('User blocking error:', error);
    }
  }

  async isUserBlocked(userId) {
    try {
      const blockKey = `blocked-user:${userId}`;
      const result = await redis.get(blockKey);
      return result !== null;
    } catch (error) {
      logger.error('User block check error:', error);
      return false;
    }
  }
}

module.exports = new AuthService();

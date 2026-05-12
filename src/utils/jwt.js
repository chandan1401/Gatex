const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('./logger');

const generateToken = (payload, isRefresh = false) => {
  try {
    const secret = isRefresh ? config.jwt.refresh_secret : config.jwt.secret;
    const expiresIn = isRefresh ? config.jwt.refresh_expiry : config.jwt.expiry;

    const token = jwt.sign(payload, secret, {
      expiresIn,
      issuer: 'gatex-api-gateway',
      audience: 'gatex-client',
    });

    return token;
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw error;
  }
};

const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh ? config.jwt.refresh_secret : config.jwt.secret;

    const decoded = jwt.verify(token, secret, {
      issuer: 'gatex-api-gateway',
      audience: 'gatex-client',
    });

    return decoded;
  } catch (error) {
    logger.warn('Token verification failed:', error.message);
    throw error;
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Token decode failed:', error);
    return null;
  }
};

const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken, true);
    const newAccessToken = generateToken(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
      false
    );

    return newAccessToken;
  } catch (error) {
    logger.error('Token refresh failed:', error);
    throw error;
  }
};

const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  refreshAccessToken,
  isTokenExpired,
};

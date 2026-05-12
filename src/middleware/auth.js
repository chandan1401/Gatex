const jwt = require('../utils/jwt');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');

const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json(ApiResponse.unauthorized('No token provided'));
    }

    const decoded = jwt.verifyToken(token);
    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    logger.warn('Authentication failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json(ApiResponse.unauthorized('Token expired'));
    }

    if (error.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json(ApiResponse.unauthorized('Invalid token'));
    }

    res.status(401).json(ApiResponse.unauthorized('Authentication failed'));
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(ApiResponse.unauthorized('Not authenticated'));
    }

    const userRole = req.user.role || ROLES.GUEST;

    if (!allowedRoles.includes(userRole)) {
      logger.warn('Authorization failed', {
        userId: req.user.userId,
        userRole,
        allowedRoles,
      });
      return res
        .status(403)
        .json(ApiResponse.forbidden('Insufficient permissions'));
    }

    next();
  };
};

const validateApiKey = (req, res, next) => {
  const config = require('../config/env');
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res
      .status(401)
      .json(ApiResponse.unauthorized('API key required'));
  }

  if (apiKey !== config.security.apiKey) {
    logger.warn('Invalid API key attempt', { apiKey });
    return res
      .status(401)
      .json(ApiResponse.unauthorized('Invalid API key'));
  }

  req.isServiceRequest = true;
  next();
};

const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

const optional = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = jwt.verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    logger.debug('Optional authentication failed:', error.message);
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  validateApiKey,
  optional,
};

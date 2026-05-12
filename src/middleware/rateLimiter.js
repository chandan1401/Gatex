const { RedisStore } = require('rate-limit-redis');
const rateLimit = require('express-rate-limit');
const { getRedisClient } = require('../config/redis');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const config = require('../config/env');

const redisClient = getRedisClient();

const createRateLimiter = (options = {}) => {
  const {
    windowMs = config.rateLimit.windowMs,
    max = config.rateLimit.maxRequests,
    keyPrefix = config.rateLimit.keyPrefix,
    message = 'Too many requests, please try again later.',
    skip = null,
    onLimitReached = null,
  } = options;

  return rateLimit({
    store: new RedisStore({
      sendCommand: async (...args) => redisClient.call(...args),
      prefix: keyPrefix,
    }),
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      if (req.isServiceRequest) return true;
      if (skip) return skip(req);
      return false;
    },
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        key: req.ip,
      });

      if (onLimitReached) {
        onLimitReached(req, res);
      }

      res.status(429).json(ApiResponse.rateLimited());
    },
  });
};

// General API limiter
const apiLimiter = createRateLimiter({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  keyPrefix: `${config.rateLimit.keyPrefix}:api`,
});

// Strict limiter for auth endpoints
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  keyPrefix: `${config.rateLimit.keyPrefix}:auth`,
});

// Moderate limiter for general endpoints
const moderateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  keyPrefix: `${config.rateLimit.keyPrefix}:moderate`,
});

// IP-based tracking for abuse detection
const trackIpUsage = async (req, res, next) => {
  try {
    const ip = req.ip;
    const ipKey = `ip-usage:${ip}`;

    const usage = await redisClient.incr(ipKey);

    if (usage === 1) {
      await redisClient.expire(ipKey, 3600); // Expire after 1 hour
    }

    req.ipUsageCount = usage;

    // Alert if suspicious activity
    if (usage > config.rateLimit.maxRequests * 2) {
      logger.warn('Suspicious IP activity detected', {
        ip,
        requestCount: usage,
      });
    }

    next();
  } catch (error) {
    logger.error('IP tracking error:', error);
    next(); // Don't block the request
  }
};

module.exports = {
  createRateLimiter,
  apiLimiter,
  authLimiter,
  moderateLimiter,
  trackIpUsage,
};

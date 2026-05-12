const cacheService = require('../services/cacheService');
const logger = require('../utils/logger');

class RedisCache {
  constructor(prefix = 'cache:') {
    this.prefix = prefix;
  }

  generateKey(...parts) {
    return `${this.prefix}${parts.join(':')}`;
  }

  async cacheResponse(req, res, next) {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = this.generateKey(req.user?.userId || 'anon', req.path, JSON.stringify(req.query));

    try {
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        logger.debug(`Returning cached response for ${req.path}`);
        return res.json(cachedData);
      }
    } catch (error) {
      logger.error('Cache retrieval error:', error);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (data) {
      if (res.statusCode === 200) {
        cacheService.set(cacheKey, data, 3600).catch((err) => {
          logger.error('Cache set error:', err);
        });
      }

      return originalJson(data);
    };

    next();
  }

  async invalidatePattern(pattern) {
    const fullPattern = `${this.prefix}${pattern}`;
    const count = await cacheService.delPattern(fullPattern);
    logger.info(`Invalidated ${count} cache entries for pattern: ${pattern}`);
    return count;
  }

  async invalidateUserCache(userId) {
    return this.invalidatePattern(`${userId}:*`);
  }

  async invalidateApiEndpoint(endpoint) {
    return this.invalidatePattern(`*:${endpoint}:*`);
  }
}

module.exports = new RedisCache();

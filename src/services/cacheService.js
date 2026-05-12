const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');
const config = require('../config/env');

const redis = getRedisClient();

class CacheService {
  async get(key) {
    try {
      if (!config.cache.enabled) return null;

      const value = await redis.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return JSON.parse(value);
      }

      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = config.cache.ttl) {
    try {
      if (!config.cache.enabled) return false;

      await redis.setex(key, ttl, JSON.stringify(value));
      logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await redis.del(key);
      logger.debug(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.debug(`Deleted ${keys.length} cache keys matching: ${pattern}`);
      }
      return keys.length;
    } catch (error) {
      logger.error('Cache pattern delete error:', error);
      return 0;
    }
  }

  async clear() {
    try {
      await redis.flushdb();
      logger.warn('Cache cleared');
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists check error:', error);
      return false;
    }
  }

  async increment(key, amount = 1) {
    try {
      const result = await redis.incrby(key, amount);
      return result;
    } catch (error) {
      logger.error('Cache increment error:', error);
      return null;
    }
  }

  async expire(key, ttl) {
    try {
      await redis.expire(key, ttl);
      logger.debug(`Cache expiry updated: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error('Cache expire error:', error);
      return false;
    }
  }

  async getManyByPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return {};

      const values = await redis.mget(keys);
      const result = {};

      keys.forEach((key, index) => {
        result[key] = values[index] ? JSON.parse(values[index]) : null;
      });

      return result;
    } catch (error) {
      logger.error('Cache getMany error:', error);
      return {};
    }
  }
}

module.exports = new CacheService();

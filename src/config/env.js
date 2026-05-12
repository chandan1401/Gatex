require('dotenv').config();

module.exports = {
  // Server
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  log_level: process.env.LOG_LEVEL || 'info',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production-32-chars-min',
    expiry: process.env.JWT_EXPIRY || '24h',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'change-refresh-secret',
    refresh_expiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    db: parseInt(process.env.REDIS_DB) || 0,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gatex',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },

  // Rate Limiter
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    enabled: process.env.RATE_LIMIT_ENABLE === 'true',
    keyPrefix: process.env.RATE_LIMIT_KEY_PREFIX || 'api-limiter',
  },

  // Circuit Breaker
  circuitBreaker: {
    threshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD) || 5,
    timeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT) || 30000,
    resetTimeout: parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT) || 60000,
  },

  // Microservices
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
  },

  // Prometheus
  prometheus: {
    enabled: process.env.PROMETHEUS_ENABLED === 'true',
    port: parseInt(process.env.PROMETHEUS_PORT) || 9090,
    metricsPath: process.env.PROMETHEUS_METRICS_PATH || '/metrics',
  },

  // Cache
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600,
    enabled: process.env.CACHE_ENABLED === 'true',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Logging
  logging: {
    dir: process.env.LOG_DIR || './src/logs',
    maxSize: parseInt(process.env.LOG_MAX_SIZE) || 5242880,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
  },

  // WebSocket
  websocket: {
    enabled: process.env.WEBSOCKET_ENABLED === 'true',
    port: parseInt(process.env.WEBSOCKET_PORT) || 3005,
  },

  // Security
  security: {
    helmetEnabled: process.env.HELMET_ENABLED === 'true',
    apiKey: process.env.API_KEY_VALID,
  },

  // Service Discovery
  serviceDiscovery: {
    enabled: process.env.SERVICE_DISCOVERY_ENABLED === 'true',
    consul: {
      host: process.env.CONSUL_HOST || 'localhost',
      port: parseInt(process.env.CONSUL_PORT) || 8500,
    },
  },
};

const client = require('prom-client');
const config = require('../config/env');
const logger = require('../utils/logger');

// Create a Registry
const register = new client.Registry();

// Gauge: Active connections
const activeConnections = new client.Gauge({
  name: 'gateway_active_connections',
  help: 'Number of active connections',
  registers: [register],
});

// Counter: Total requests
const totalRequests = new client.Counter({
  name: 'gateway_total_requests',
  help: 'Total number of requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
});

// Counter: Total errors
const totalErrors = new client.Counter({
  name: 'gateway_total_errors',
  help: 'Total number of errors',
  labelNames: ['error_type', 'service'],
  registers: [register],
});

// Histogram: Request duration
const requestDuration = new client.Histogram({
  name: 'gateway_request_duration_seconds',
  help: 'Request duration in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Gauge: Service health
const serviceHealth = new client.Gauge({
  name: 'gateway_service_health',
  help: 'Service health status (1=healthy, 0=unhealthy)',
  labelNames: ['service'],
  registers: [register],
});

// Gauge: Circuit breaker state
const circuitBreakerState = new client.Gauge({
  name: 'gateway_circuit_breaker_state',
  help: 'Circuit breaker state (0=CLOSED, 1=OPEN, 2=HALF_OPEN)',
  labelNames: ['breaker_name'],
  registers: [register],
});

// Counter: Cache hits/misses
const cacheOperations = new client.Counter({
  name: 'gateway_cache_operations',
  help: 'Cache operations (hits/misses)',
  labelNames: ['operation'],
  registers: [register],
});

// Gauge: Rate limiter status
const rateLimitStatus = new client.Gauge({
  name: 'gateway_rate_limit_hits',
  help: 'Rate limit hits',
  labelNames: ['ip'],
  registers: [register],
});

// Setup default metrics
client.collectDefaultMetrics({ register });

const metricsMiddleware = (req, res, next) => {
  req.startTime = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - req.startTime) / 1000;
    activeConnections.dec();

    totalRequests.labels(req.method, req.path, res.statusCode).inc();
    requestDuration
      .labels(req.method, req.path, res.statusCode)
      .observe(duration);

    if (res.statusCode >= 400) {
      totalErrors.labels('http_error', req.service || 'gateway').inc();
    }
  });

  next();
};

const getMetrics = async () => {
  if (!config.prometheus.enabled) {
    return 'Prometheus metrics disabled';
  }

  return register.metrics();
};

const getMetricsContentType = () => register.contentType;

module.exports = {
  register,
  metricsMiddleware,
  getMetrics,
  getMetricsContentType,
  totalRequests,
  totalErrors,
  requestDuration,
  activeConnections,
  serviceHealth,
  circuitBreakerState,
  cacheOperations,
  rateLimitStatus,
};

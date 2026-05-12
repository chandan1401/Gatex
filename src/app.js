const express = require('express');
const helmet = require('helmet');
require('express-async-errors');

const config = require('./config/env');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const requestIdMiddleware = require('./middleware/logger');
const corsMiddleware = require('./middleware/cors');
const { apiLimiter, authLimiter, trackIpUsage } = require('./middleware/rateLimiter');
const { getMetrics, getMetricsContentType, metricsMiddleware } = require('./monitoring/prometheus');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Services
const proxyService = require('./services/proxyService');
const monitoringService = require('./services/monitoringService');
const cacheService = require('./services/cacheService');
const redisCache = require('./cache/redisCache');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Security middleware
if (config.security.helmetEnabled) {
  app.use(helmet());
}

// CORS middleware
app.use(corsMiddleware);

// Request ID middleware
app.use(requestIdMiddleware);

// Metrics middleware
app.use(metricsMiddleware);

// IP tracking
app.use(trackIpUsage);

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', getMetricsContentType());
    res.send(metrics);
  } catch (error) {
    logger.error('Error retrieving metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

// Monitoring endpoint
app.get('/api/v1/monitoring/metrics', (req, res) => {
  const metrics = monitoringService.getMetrics();
  res.json(metrics);
});

app.get('/api/v1/monitoring/health', (req, res) => {
  const health = monitoringService.getServiceHealth();
  res.json(health);
});

// API v1 routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', apiLimiter, userRoutes);
app.use('/api/v1/orders', apiLimiter, orderRoutes);
app.use('/api/v1/payments', apiLimiter, paymentRoutes);

// Cache management endpoints
app.post('/api/v1/cache/invalidate', async (req, res) => {
  try {
    const { pattern } = req.body;
    
    if (!pattern) {
      return res.status(400).json({ error: 'Pattern required' });
    }

    const count = await redisCache.invalidatePattern(pattern);
    res.json({ invalidated: count, pattern });
  } catch (error) {
    logger.error('Cache invalidation error:', error);
    res.status(500).json({ error: 'Cache invalidation failed' });
  }
});

app.post('/api/v1/cache/clear', async (req, res) => {
  try {
    await cacheService.clear();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    logger.error('Cache clear error:', error);
    res.status(500).json({ error: 'Cache clear failed' });
  }
});

// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    version: '1.0.0',
    title: 'GateX API Gateway',
    description: 'Production-grade API Gateway with microservices architecture',
    baseUrl: `http://${config.host}:${config.port}`,
    endpoints: {
      auth: {
        login: 'POST /api/v1/auth/login',
        register: 'POST /api/v1/auth/register',
        refreshToken: 'POST /api/v1/auth/refresh-token',
        logout: 'POST /api/v1/auth/logout',
        me: 'GET /api/v1/auth/me',
      },
      users: {
        list: 'GET /api/v1/users',
        get: 'GET /api/v1/users/:userId',
        update: 'PUT /api/v1/users/:userId',
        delete: 'DELETE /api/v1/users/:userId',
      },
      orders: {
        list: 'GET /api/v1/orders',
        create: 'POST /api/v1/orders',
        get: 'GET /api/v1/orders/:orderId',
        update: 'PUT /api/v1/orders/:orderId',
        cancel: 'POST /api/v1/orders/:orderId/cancel',
      },
      payments: {
        process: 'POST /api/v1/payments/process',
        get: 'GET /api/v1/payments/:transactionId',
        refund: 'POST /api/v1/payments/refund',
      },
      monitoring: {
        metrics: 'GET /api/v1/monitoring/metrics',
        health: 'GET /api/v1/monitoring/health',
        prometheusMetrics: 'GET /metrics',
      },
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

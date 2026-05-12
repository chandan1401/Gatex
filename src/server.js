require('dotenv').config();

const http = require('http');
const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');
const { connectDB } = require('./config/db');
const { getRedisClient, ping: pingRedis } = require('./config/redis');
const { startSocketServer } = require('./websocket/socketServer');

let server;

async function startServer() {
  try {
    // Connect to MongoDB
    if (config.node_env === 'production') {
      try {
        await connectDB();
      } catch (error) {
        logger.warn('MongoDB connection failed, running in offline mode', error.message);
      }
    }

    // Connect to Redis
    try {
      const redisConnected = await pingRedis();
      if (redisConnected) {
        logger.info('Redis connection verified');
      }
    } catch (error) {
      logger.warn('Redis connection failed, running in offline mode:', error.message);
    }

    // Create HTTP server
    server = http.createServer(app);

    // Setup WebSocket if enabled
    if (config.websocket.enabled) {
      startSocketServer(server);
    }

    // Start server
    server.listen(config.port, config.host, () => {
      logger.info(`🚀 GateX API Gateway started`, {
        host: config.host,
        port: config.port,
        environment: config.node_env,
        timestamp: new Date().toISOString(),
      });

      logger.info('Available endpoints:', {
        health: `http://${config.host}:${config.port}/health`,
        metrics: `http://${config.host}:${config.port}/metrics`,
        apiDocs: `http://${config.host}:${config.port}/api-docs`,
      });

      if (config.prometheus.enabled) {
        logger.info('📊 Prometheus metrics enabled at /metrics');
      }

      if (config.websocket.enabled) {
        logger.info('🔌 WebSocket server enabled');
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', error);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', shutdownServer);
    process.on('SIGINT', shutdownServer);

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdownServer() {
  logger.info('Shutting down server...');

  if (server) {
    server.close(async () => {
      logger.info('Server closed');

      // Close Redis connection
      try {
        const redis = getRedisClient();
        if (redis) {
          await redis.quit();
          logger.info('Redis connection closed');
        }
      } catch (error) {
        logger.error('Error closing Redis:', error);
      }

      logger.info('Goodbye! 👋');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  }
}

// Start server
if (require.main === module) {
  startServer();
}

module.exports = startServer;

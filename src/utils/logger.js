const pino = require('pino');
const path = require('path');
const fs = require('fs');
const config = require('../config/env');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isDevelopment = config.node_env === 'development';

const pinoConfig = {
  level: config.log_level || 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          singleLine: false,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
};

const logger = pino(pinoConfig);

// Custom logger wrapper for backward compatibility
module.exports = {
  logger,

  info: (message, data) => {
    logger.info(data || {}, message);
  },

  error: (message, error) => {
    if (error instanceof Error) {
      logger.error(
        {
          err: error,
          stack: error.stack,
        },
        message
      );
    } else {
      logger.error(error || {}, message);
    }
  },

  warn: (message, data) => {
    logger.warn(data || {}, message);
  },

  debug: (message, data) => {
    logger.debug(data || {}, message);
  },

  trace: (message, data) => {
    logger.trace(data || {}, message);
  },

  // For direct pino usage
  pino: logger,
};

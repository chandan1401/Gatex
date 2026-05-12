const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

class RequestIdManager {
  static generateRequestId() {
    return uuidv4();
  }

  static extractRequestId(req) {
    const requestId =
      req.headers['x-request-id'] ||
      req.headers['x-correlation-id'] ||
      this.generateRequestId();

    req.requestId = requestId;
    req.traceId = req.headers['x-trace-id'] || requestId;

    return requestId;
  }

  static getRequestContext(req) {
    return {
      requestId: req.requestId,
      traceId: req.traceId,
      userId: req.user?.userId || 'anonymous',
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };
  }

  static logRequest(req, res) {
    const context = this.getRequestContext(req);
    const responseTime = Date.now() - req.startTime;

    logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      ...context,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  }
}

module.exports = RequestIdManager;

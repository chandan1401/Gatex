const logger = require('../utils/logger');

class MonitoringService {
  constructor() {
    this.metrics = {
      requests: 0,
      responses: 0,
      errors: 0,
      totalResponseTime: 0,
      activeConnections: 0,
    };

    this.serviceMetrics = {};
  }

  recordRequest(req) {
    this.metrics.requests++;
    this.metrics.activeConnections++;
    req.startTime = Date.now();
  }

  recordResponse(req, res) {
    const responseTime = Date.now() - req.startTime;

    this.metrics.responses++;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.activeConnections--;

    if (res.statusCode >= 400) {
      this.metrics.errors++;
    }

    this.recordServiceMetric(req.service || 'gateway', responseTime, res.statusCode);
  }

  recordServiceMetric(serviceName, responseTime, statusCode) {
    if (!this.serviceMetrics[serviceName]) {
      this.serviceMetrics[serviceName] = {
        requests: 0,
        totalResponseTime: 0,
        errors: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
      };
    }

    const metric = this.serviceMetrics[serviceName];
    metric.requests++;
    metric.totalResponseTime += responseTime;
    metric.minResponseTime = Math.min(metric.minResponseTime, responseTime);
    metric.maxResponseTime = Math.max(metric.maxResponseTime, responseTime);

    if (statusCode >= 400) {
      metric.errors++;
    }
  }

  getMetrics() {
    const avgResponseTime =
      this.metrics.requests > 0
        ? this.metrics.totalResponseTime / this.metrics.responses
        : 0;

    return {
      gateway: {
        totalRequests: this.metrics.requests,
        totalResponses: this.metrics.responses,
        totalErrors: this.metrics.errors,
        averageResponseTime: Math.round(avgResponseTime),
        activeConnections: this.metrics.activeConnections,
        errorRate:
          this.metrics.responses > 0
            ? ((this.metrics.errors / this.metrics.responses) * 100).toFixed(2)
            : 0,
      },
      services: Object.entries(this.serviceMetrics).map(([name, metric]) => ({
        name,
        totalRequests: metric.requests,
        averageResponseTime: Math.round(
          metric.totalResponseTime / metric.requests
        ),
        minResponseTime: metric.minResponseTime,
        maxResponseTime: metric.maxResponseTime,
        errorCount: metric.errors,
        errorRate:
          metric.requests > 0
            ? ((metric.errors / metric.requests) * 100).toFixed(2)
            : 0,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  resetMetrics() {
    this.metrics = {
      requests: 0,
      responses: 0,
      errors: 0,
      totalResponseTime: 0,
      activeConnections: 0,
    };
    this.serviceMetrics = {};
    logger.info('Metrics reset');
  }

  getServiceHealth() {
    const health = {};

    Object.entries(this.serviceMetrics).forEach(([serviceName, metric]) => {
      const errorRate = metric.requests > 0 
        ? (metric.errors / metric.requests) * 100
        : 0;

      health[serviceName] = {
        status: errorRate < 5 ? 'healthy' : 'degraded',
        errorRate: errorRate.toFixed(2),
        averageResponseTime: Math.round(
          metric.totalResponseTime / metric.requests
        ),
      };
    });

    return health;
  }
}

module.exports = new MonitoringService();

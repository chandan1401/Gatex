const httpProxy = require('http-proxy');
const axios = require('axios');
const logger = require('../utils/logger');
const ApiResponse = require('../utils/responseFormatter');
const config = require('../config/env');

class ProxyService {
  constructor() {
    this.proxy = httpProxy.createProxyServer({
      changeOrigin: true,
      timeout: 30000,
      proxyTimeout: 30000,
    });

    this.setupProxyListeners();
  }

  setupProxyListeners() {
    this.proxy.on('error', (err, req, res) => {
      logger.error('Proxy error:', {
        error: err.message,
        target: req.target,
        path: req.path,
      });

      res.status(503).json(
        ApiResponse.serviceUnavailable(
          'Unable to connect to service'
        )
      );
    });

    this.proxy.on('proxyReq', (proxyReq, req, res) => {
      if (req.requestId) {
        proxyReq.setHeader('X-Request-ID', req.requestId);
        proxyReq.setHeader('X-Trace-ID', req.traceId);
      }

      if (req.user) {
        proxyReq.setHeader('X-User-ID', req.user.userId);
        proxyReq.setHeader('X-User-Role', req.user.role);
      }

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    });

    this.proxy.on('proxyRes', (proxyRes, req, res) => {
      proxyRes.headers['X-Request-ID'] = req.requestId;
      proxyRes.headers['X-Proxy-By'] = 'gatex-api-gateway';
    });
  }

  forward(req, res, target) {
    try {
      logger.info(`Proxying request to ${target}`, {
        path: req.path,
        method: req.method,
        requestId: req.requestId,
      });

      req.target = target;
      this.proxy.web(req, res, { target });
    } catch (error) {
      logger.error('Proxy forward error:', error);
      res.status(503).json(
        ApiResponse.serviceUnavailable()
      );
    }
  }

  async healthCheck(serviceUrl) {
    try {
      const response = await axios.get(`${serviceUrl}/health`, {
        timeout: 5000,
      });

      return response.status === 200;
    } catch (error) {
      logger.warn(`Health check failed for ${serviceUrl}:`, error.message);
      return false;
    }
  }
}

module.exports = new ProxyService();

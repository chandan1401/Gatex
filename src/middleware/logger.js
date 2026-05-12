const RequestIdManager = require('../utils/requestId');

const requestIdMiddleware = (req, res, next) => {
  req.startTime = Date.now();
  RequestIdManager.extractRequestId(req);

  res.on('finish', () => {
    RequestIdManager.logRequest(req, res);
  });

  next();
};

module.exports = requestIdMiddleware;

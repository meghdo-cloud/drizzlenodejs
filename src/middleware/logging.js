const logger = require('../utils/logger');

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      duration: `${duration}ms`,
      status: res.statusCode
    });
  });

  logger.info('Request received', {
    method: req.method,
    path: req.path,
    remoteAddr: req.ip
  });

  next();
};

module.exports = loggingMiddleware;
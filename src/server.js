const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info('Server starting', { port });
});
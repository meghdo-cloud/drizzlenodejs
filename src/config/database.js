const { Pool } = require('pg');
const logger = require('../utils/logger');

// Get database credentials from environment variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT || '5432';

if (!dbPort) {
  logger.info('No DB_PORT specified, using default: 5432');
}

// Create connection pool with the same configuration as Go version
const pool = new Pool({
  host: '127.0.0.1', // Fixed to localhost since using cloudsql-proxy
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  ssl: false
});

// Log database connection attempt
logger.info('Attempting database connection', {
  host: '127.0.0.1',
  port: dbPort,
  db_name: dbName
});

// Error handling
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err.message });
  process.exit(-1);
});

module.exports = pool;
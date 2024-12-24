const express = require('express');
const logger = require('./utils/logger');
const loggingMiddleware = require('./middleware/logging');
const { router: healthRoutes, setReady } = require('./routes/health');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
const urlPrefix = process.env.URL_PREFIX || '';
app.use(urlPrefix, healthRoutes);
app.use(urlPrefix, userRoutes);

// Initialize database connection
const pool = require('./config/database');

// Test database connection and set ready state
async function initializeApp() {
  try {
    await pool.query('SELECT 1');
    logger.info('Successfully connected to database');
    setReady(true);
  } catch (err) {
    logger.error('Failed to connect to database', { error: err.message });
    setReady(false);
  }
}

initializeApp();

module.exports = app;
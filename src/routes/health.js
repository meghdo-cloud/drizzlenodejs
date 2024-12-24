const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const pool = require('../config/database');

let isReady = false;

router.get('/isActive', (req, res) => {
  logger.debug('Health check called');
  res.json({ message: 'Welcome to Drizzle' });
});

router.get('/health/live', (req, res) => {
  logger.debug('Liveness check called');
  res.json({ status: 'alive' });
});

router.get('/health/ready', async (req, res) => {
  if (!isReady) {
    logger.warn('Readiness check failed: application not ready');
    return res.status(503).json({ status: 'not ready' });
  }

  try {
    await pool.query('SELECT 1');
    logger.debug('Readiness check passed');
    res.json({ status: 'ready' });
  } catch (err) {
    logger.error('Readiness check failed: database not responding', { error: err.message });
    res.status(503).json({ status: 'database not ready' });
  }
});

module.exports = { router, setReady: (ready) => { isReady = ready; } };

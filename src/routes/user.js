const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const pool = require('../config/database');

router.post('/data', async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    logger.error('Failed to create user: missing required fields');
    return res.status(400).json({ error: 'ID and name are required' });
  }

  try {
    logger.info('Attempting to create new user', { user_id: id, user_name: name });
    
    await pool.query(
      'INSERT INTO tablea (id, name) VALUES ($1, $2)',
      [id, name]
    );

    logger.info('Successfully created new user', { user_id: id, user_name: name });
    res.status(201).json({ id, name });
  } catch (err) {
    logger.error('Failed to insert user into database', {
      error: err.message,
      user_id: id,
      user_name: name
    });
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
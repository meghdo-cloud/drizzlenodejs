const express = require('express');
const logger = require('./utils/logger');
const loggingMiddleware = require('./middleware/logging');
const { router: healthRoutes, setReady } = require('./routes/health');
const userRoutes = require('./routes/user');
const pool = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
const urlPrefix = process.env.URL_PREFIX || '';
app.use(urlPrefix, healthRoutes);
app.use(urlPrefix, userRoutes);

// Initialize database connection with retries
async function initializeApp() {
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            await pool.query('SELECT 1');
            logger.info('Successfully connected to database');
            setReady(true);
            return;
        } catch (err) {
            retries++;
            logger.error('Failed to connect to database', { 
                error: err.message,
                attempt: retries,
                maxRetries: maxRetries
            });
            
            if (retries < maxRetries) {
                logger.info(`Retrying database connection in ${retryDelay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    
    logger.error('Maximum database connection attempts reached. Application not ready.');
    setReady(false);
}

// Call initialization immediately
initializeApp();

// Add graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    try {
        await pool.end();
        logger.info('Database pool closed');
        process.exit(0);
    } catch (err) {
        logger.error('Error during shutdown', { error: err.message });
        process.exit(1);
    }
});

module.exports = app;
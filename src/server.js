import dotenv from 'dotenv';
// Load environment variables immediately before importing anything else
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';

// Uncaught exceptions listener
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! 💥 Shutting down... Reason: ${err.name} - ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Database Connectivity
connectDB();

// Server execution
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

// Unhandled rejections listener
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! 💥 Shutting down server... Reason: ${err.name} - ${err.message}`);
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

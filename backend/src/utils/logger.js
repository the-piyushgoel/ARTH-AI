// ============================================================
// ARTH Backend — Logger Utility
// Structured logging with timestamps and log levels.
// Replace with Winston/Pino in production if needed.
// ============================================================

const config = require('../config');

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * Formats a log message with timestamp and level.
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} [meta] - Optional metadata
 */
const formatLog = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

const logger = {
  error: (message, meta) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, meta));
  },
  info: (message, meta) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, meta));
  },
  debug: (message, meta) => {
    if (config.nodeEnv === 'development') {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, meta));
    }
  },
};

module.exports = logger;

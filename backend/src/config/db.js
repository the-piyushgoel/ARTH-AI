// ============================================================
// ARTH Backend — Database Connection
// Connects to MongoDB using Mongoose with retry logic.
// ============================================================

const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure — let process manager restart
    process.exit(1);
  }
};

module.exports = connectDB;

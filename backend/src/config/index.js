// ============================================================
// ARTH Backend — Configuration
// Centralizes all environment variables and app constants.
// ============================================================

const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/arth',
  jwtSecret: process.env.JWT_SECRET || 'default_dev_secret',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;

// ============================================================
// ARTH Backend — Server Entry Point
// Connects to MongoDB and starts the Express server.
// ============================================================

const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(config.port, () => {
      logger.info(`🚀 ARTH Backend running on port ${config.port}`);
      logger.info(`📡 Environment: ${config.nodeEnv}`);
      logger.info(`🤖 ML Service URL: ${config.mlServiceUrl}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

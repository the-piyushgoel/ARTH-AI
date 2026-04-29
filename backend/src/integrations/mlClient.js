// ============================================================
// ARTH Backend — ML Client Integration
// Axios client for communicating with the FastAPI ML service.
// All ML calls go through this module for centralized error
// handling and logging.
// ============================================================

const axios = require('axios');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// Create a dedicated Axios instance for ML service
const mlApi = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 30000, // 30 second timeout for ML predictions
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic ML service request handler with error handling.
 * @param {string} method - HTTP method
 * @param {string} endpoint - API path (e.g., /ml/simulation/predict)
 * @param {object} data - Request body
 * @returns {object} Response data from ML service
 */
const mlRequest = async (method, endpoint, data = null) => {
  try {
    logger.debug(`ML Request: ${method.toUpperCase()} ${endpoint}`, data);

    const response = await mlApi({ method, url: endpoint, data });

    logger.debug(`ML Response: ${endpoint}`, response.data);
    return response.data;
  } catch (error) {
    // Handle ML service errors with clear messages
    if (error.response) {
      // ML service returned an error response
      logger.error(`ML Service error on ${endpoint}`, {
        status: error.response.status,
        data: error.response.data,
      });
      throw ApiError.internal(
        `ML Service error: ${error.response.data?.detail || 'Unknown ML error'}`
      );
    } else if (error.code === 'ECONNREFUSED') {
      // ML service is not running
      logger.error('ML Service is not reachable. Is it running?');
      throw ApiError.internal(
        'ML Service is currently unavailable. Please ensure the ML service is running.'
      );
    } else {
      // Network or other error
      logger.error(`ML Client error: ${error.message}`);
      throw ApiError.internal(`ML Service communication error: ${error.message}`);
    }
  }
};

// ---- Specific ML API methods ----

/**
 * Predict future financial state.
 */
const predictSimulation = async (payload) => {
  return mlRequest('post', '/ml/simulation/predict', payload);
};

/**
 * Get credit score.
 */
const getCreditScore = async (payload) => {
  return mlRequest('post', '/ml/credit/score', payload);
};

/**
 * Get credit score explanation.
 */
const getCreditExplanation = async (payload) => {
  return mlRequest('post', '/ml/credit/explain', payload);
};

/**
 * Detect fraud risk.
 */
const detectFraud = async (payload) => {
  return mlRequest('post', '/ml/fraud/detect', payload);
};

/**
 * Health check for ML service.
 */
const healthCheck = async () => {
  return mlRequest('get', '/ml/health');
};

module.exports = {
  predictSimulation,
  getCreditScore,
  getCreditExplanation,
  detectFraud,
  healthCheck,
};

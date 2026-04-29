// ============================================================
// ARTH Backend — Express App Setup
// Configures middleware, routes, and error handling.
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import route modules
const authRoutes = require('./modules/auth/auth.route');
const userRoutes = require('./modules/user/user.route');
const transactionRoutes = require('./modules/transaction/transaction.route');
const simulationRoutes = require('./modules/simulation/simulation.route');
const creditRoutes = require('./modules/credit/credit.route');
const fraudRoutes = require('./modules/fraud/fraud.route');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ---- Global Middleware ----
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (dev mode)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---- Health Check ----
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'ARTH Backend',
      status: 'running',
      timestamp: new Date().toISOString(),
    },
  });
});

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/fraud', fraudRoutes);

// ---- 404 Handler ----
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ---- Global Error Handler (must be last) ----
app.use(errorHandler);

module.exports = app;

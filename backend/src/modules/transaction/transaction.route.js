// ============================================================
// ARTH Backend — Transaction Routes
// ============================================================

const express = require('express');
const router = express.Router();
const transactionController = require('./transaction.controller');
const asyncHandler = require('../../utils/asyncHandler');
const authMiddleware = require('../../middlewares/authMiddleware');
const validateRequest = require('../../middlewares/validateRequest');

// All transaction routes require authentication
router.use(authMiddleware);

// POST /api/transactions
router.post(
  '/',
  validateRequest(['type', 'category', 'amount']),
  asyncHandler(transactionController.createTransaction)
);

// GET /api/transactions
router.get('/', asyncHandler(transactionController.getUserTransactions));

// GET /api/transactions/summary
router.get('/summary', asyncHandler(transactionController.getTransactionSummary));

module.exports = router;

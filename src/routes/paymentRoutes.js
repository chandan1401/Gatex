const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');
const { validateBody } = require('../middleware/validateRequest');
const { paymentValidator } = require('../validators/authValidator');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const router = express.Router();

// Process payment
router.post(
  '/process',
  authenticate,
  validateBody(paymentValidator.process),
  asyncHandler(async (req, res) => {
    const { orderId, amount, currency, method } = req.body;

    // Mock payment processing
    const transaction = {
      transactionId: 'txn-' + Date.now(),
      orderId,
      amount,
      currency,
      method,
      status: 'success',
      timestamp: new Date(),
    };

    logger.info('Payment processed:', {
      transactionId: transaction.transactionId,
      orderId,
      amount,
    });

    res.status(201).json(
      ApiResponse.created(transaction, 'Payment processed successfully')
    );
  })
);

// Get transaction
router.get(
  '/:transactionId',
  authenticate,
  asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    // Mock transaction
    const transaction = {
      transactionId,
      orderId: 'order-123',
      amount: 199.99,
      currency: 'USD',
      status: 'success',
      timestamp: new Date(),
    };

    res.json(ApiResponse.success(transaction, 'Transaction retrieved'));
  })
);

// Refund payment
router.post(
  '/refund',
  authenticate,
  validateBody(paymentValidator.refund),
  asyncHandler(async (req, res) => {
    const { transactionId, reason } = req.body;

    const refund = {
      refundId: 'refund-' + Date.now(),
      transactionId,
      reason,
      status: 'success',
      timestamp: new Date(),
    };

    logger.info('Refund processed:', { refundId: refund.refundId, transactionId });

    res.json(ApiResponse.success(refund, 'Refund processed successfully'));
  })
);

module.exports = router;

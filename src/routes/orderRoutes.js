const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');
const { validateBody, validateQuery } = require('../middleware/validateRequest');
const { orderValidator } = require('../validators/authValidator');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const proxyService = require('../services/proxyService');
const config = require('../config/env');
const cacheService = require('../services/cacheService');

const router = express.Router();

// Get all orders
router.get(
  '/',
  authenticate,
  validateQuery(orderValidator.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    // Try to get from cache
    const cacheKey = `orders:${req.user.userId}:${page}:${limit}:${status || 'all'}`;
    let orders = await cacheService.get(cacheKey);

    if (!orders) {
      // Mock orders data
      orders = [
        {
          id: 'order-1',
          userId: req.user.userId,
          status: 'delivered',
          total: 199.99,
          createdAt: new Date(),
        },
        {
          id: 'order-2',
          userId: req.user.userId,
          status: 'shipped',
          total: 49.99,
          createdAt: new Date(),
        },
      ];

      // Cache the result
      await cacheService.set(cacheKey, orders);
    }

    const total = orders.length;

    res.json(ApiResponse.paginated(orders, page, limit, total, 'Orders retrieved'));
  })
);

// Create new order
router.post(
  '/',
  authenticate,
  validateBody(orderValidator.create),
  asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    const newOrder = {
      id: 'order-' + Date.now(),
      userId: req.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      createdAt: new Date(),
    };

    // Invalidate cache
    await cacheService.delPattern(`orders:${req.user.userId}:*`);

    logger.info('Order created:', { orderId: newOrder.id, userId: req.user.userId });

    res.status(201).json(ApiResponse.created(newOrder, 'Order created'));
  })
);

// Get order by ID
router.get(
  '/:orderId',
  authenticate,
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    // Mock order
    const order = {
      id: orderId,
      userId: req.user.userId,
      status: 'shipped',
      total: 199.99,
      createdAt: new Date(),
    };

    res.json(ApiResponse.success(order, 'Order retrieved'));
  })
);

// Update order
router.put(
  '/:orderId',
  authenticate,
  validateBody(orderValidator.update),
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, shippingAddress } = req.body;

    // Invalidate cache
    await cacheService.delPattern(`orders:${req.user.userId}:*`);

    logger.info('Order updated:', { orderId, status });

    res.json(ApiResponse.success({ id: orderId, status, shippingAddress }, 'Order updated'));
  })
);

// Cancel order
router.post(
  '/:orderId/cancel',
  authenticate,
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    // Invalidate cache
    await cacheService.delPattern(`orders:${req.user.userId}:*`);

    logger.info('Order cancelled:', { orderId });

    res.json(ApiResponse.success({ id: orderId, status: 'cancelled' }, 'Order cancelled'));
  })
);

module.exports = router;

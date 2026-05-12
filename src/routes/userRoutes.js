const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody, validateQuery, validateParams } = require('../middleware/validateRequest');
const { userValidator } = require('../validators/authValidator');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');
const proxyService = require('../services/proxyService');
const config = require('../config/env');

const router = express.Router();

// Get all users (admin only)
router.get(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validateQuery(userValidator.pagination),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Mock data
    const users = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: ROLES.USER },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: ROLES.USER },
    ];

    const total = users.length;

    res.json(
      ApiResponse.paginated(users, page, limit, total, 'Users retrieved')
    );
  })
);

// Get user by ID
router.get(
  '/:userId',
  authenticate,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Mock user
    const user = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      role: ROLES.USER,
    };

    res.json(ApiResponse.success(user, 'User retrieved'));
  })
);

// Update user
router.put(
  '/:userId',
  authenticate,
  validateBody(userValidator.update),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Check if user can update (self or admin)
    if (req.user.userId !== userId && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json(ApiResponse.forbidden());
    }

    logger.info('User updated:', { userId });

    res.json(ApiResponse.success({ id: userId, ...req.body }, 'User updated'));
  })
);

// Delete user (admin only)
router.delete(
  '/:userId',
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    logger.info('User deleted:', { userId });

    res.json(ApiResponse.deleted('User deleted successfully'));
  })
);

module.exports = router;

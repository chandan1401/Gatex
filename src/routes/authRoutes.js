const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validateRequest');
const { authValidator } = require('../validators/authValidator');
const authService = require('../services/authService');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// Demo credentials
const DEMO_CREDENTIALS = [
  {
    email: 'admin@gatex.com',
    password: 'admin123',
    name: 'Admin User',
    userId: 'admin-001',
    role: ROLES.ADMIN,
  },
  {
    email: 'demo@gatex.com',
    password: 'demo123',
    name: 'Demo User',
    userId: 'user-001',
    role: ROLES.USER,
  },
  {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    userId: 'user-002',
    role: ROLES.USER,
  },
];

// Get demo credentials endpoint
router.get(
  '/demo-credentials',
  asyncHandler(async (req, res) => {
    const credentials = DEMO_CREDENTIALS.map(({ email, password }) => ({
      email,
      password,
    }));

    res.json(
      ApiResponse.success(
        credentials,
        'Demo credentials retrieved successfully'
      )
    );
  })
);

// Login endpoint
router.post(
  '/login',
  validateBody(authValidator.login),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if credentials match demo credentials
    const demoUser = DEMO_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!demoUser) {
      // Accept any email/password for demo purposes (mock response)
      const user = {
        userId: 'user-' + Date.now(),
        email,
        name: 'Test User',
        role: ROLES.USER,
      };

      const tokens = await authService.generateTokenPair(user);
      logger.info('Demo user logged in:', { email });

      return res.json(
        ApiResponse.success(
          {
            user,
            tokens,
          },
          'Login successful',
          200
        )
      );
    }

    // Use demo user
    const user = {
      userId: demoUser.userId,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
    };

    // Generate tokens
    const tokens = await authService.generateTokenPair(user);

    logger.info('Demo user logged in:', { email, role: demoUser.role });

    res.json(
      ApiResponse.success(
        {
          user,
          tokens,
        },
        'Login successful',
        200
      )
    );
  })
);

// Register endpoint
router.post(
  '/register',
  validateBody(authValidator.register),
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // This would normally create a user in database
    const user = {
      userId: 'user-' + Date.now(),
      email,
      name,
      role: ROLES.USER,
    };

    // Generate tokens
    const tokens = await authService.generateTokenPair(user);

    logger.info('New user registered:', { email });

    res.status(201).json(
      ApiResponse.created(
        {
          user,
          tokens,
        },
        'Registration successful'
      )
    );
  })
);

// Refresh token endpoint
router.post(
  '/refresh-token',
  validateBody(authValidator.refreshToken),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Decode to get userId
    const decoded = authService.jwt?.decodeToken(refreshToken);
    if (!decoded) {
      return res.status(401).json(ApiResponse.unauthorized('Invalid refresh token'));
    }

    const newTokens = await authService.refreshAccessToken(
      decoded.userId,
      refreshToken
    );

    res.json(ApiResponse.success(newTokens, 'Token refreshed successfully'));
  })
);

// Logout endpoint
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    await authService.revokeRefreshToken(req.user.userId);
    logger.info('User logged out:', { userId: req.user.userId });

    res.json(ApiResponse.success(null, 'Logged out successfully'));
  })
);

// Get current user
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(
      ApiResponse.success(req.user, 'User information retrieved')
    );
  })
);

// Change password
router.post(
  '/change-password',
  authenticate,
  validateBody(authValidator.changePassword),
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Validate old password and update to new password
    // This would normally interact with database

    logger.info('Password changed:', { userId: req.user.userId });

    res.json(ApiResponse.success(null, 'Password changed successfully'));
  })
);

module.exports = router;

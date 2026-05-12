// HTTP Status Codes
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Types
exports.ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVICE_UNAVAILABLE_ERROR: 'SERVICE_UNAVAILABLE_ERROR',
  CIRCUIT_BREAKER_ERROR: 'CIRCUIT_BREAKER_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

// API Routes
exports.API_ROUTES = {
  AUTH: '/api/v1/auth',
  USERS: '/api/v1/users',
  ORDERS: '/api/v1/orders',
  PAYMENTS: '/api/v1/payments',
  HEALTH: '/health',
  METRICS: '/metrics',
};

// Roles
exports.ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SERVICE: 'service',
  GUEST: 'guest',
};

// Permissions
exports.PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin',
};

// Cache Keys
exports.CACHE_KEYS = {
  USER: 'user:',
  AUTH_TOKEN: 'token:',
  API_RESPONSE: 'api:',
  RATE_LIMIT: 'rate-limit:',
  SESSION: 'session:',
};

// Time Constants (in milliseconds)
exports.TIME = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
};

// Service Status
exports.SERVICE_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
};

// Circuit Breaker States
exports.CIRCUIT_BREAKER_STATES = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
};

// Default Headers
exports.DEFAULT_HEADERS = {
  CONTENT_TYPE: 'application/json',
  X_REQUEST_ID: 'x-request-id',
  X_TRACE_ID: 'x-trace-id',
  AUTHORIZATION: 'authorization',
  API_KEY: 'x-api-key',
};

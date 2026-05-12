const { HTTP_STATUS, ERROR_TYPES } = require('./constants');

class ApiResponse {
  static success(data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message = 'An error occurred',
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorType = ERROR_TYPES.INTERNAL_SERVER_ERROR,
    errors = null,
    data = null
  ) {
    return {
      success: false,
      statusCode,
      message,
      errorType,
      errors,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated(data, page, limit, total, message = 'Success') {
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      timestamp: new Date().toISOString(),
    };
  }

  static created(data, message = 'Resource created successfully') {
    return this.success(data, message, HTTP_STATUS.CREATED);
  }

  static updated(data, message = 'Resource updated successfully') {
    return this.success(data, message, HTTP_STATUS.OK);
  }

  static deleted(message = 'Resource deleted successfully') {
    return this.success(null, message, HTTP_STATUS.OK);
  }

  static noContent() {
    return {
      success: true,
      statusCode: HTTP_STATUS.NO_CONTENT,
      message: 'No content',
      timestamp: new Date().toISOString(),
    };
  }

  static validationError(errors, message = 'Validation failed') {
    return this.error(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_TYPES.VALIDATION_ERROR,
      errors
    );
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_TYPES.AUTHENTICATION_ERROR
    );
  }

  static forbidden(message = 'Forbidden') {
    return this.error(
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_TYPES.AUTHORIZATION_ERROR
    );
  }

  static notFound(message = 'Resource not found') {
    return this.error(
      message,
      HTTP_STATUS.NOT_FOUND,
      ERROR_TYPES.NOT_FOUND_ERROR
    );
  }

  static rateLimited(message = 'Too many requests') {
    return this.error(
      message,
      429,
      ERROR_TYPES.RATE_LIMIT_ERROR
    );
  }

  static serviceUnavailable(message = 'Service unavailable') {
    return this.error(
      message,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_TYPES.SERVICE_UNAVAILABLE_ERROR
    );
  }

  static circuitBreakerOpen(message = 'Service is temporarily unavailable') {
    return this.error(
      message,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_TYPES.CIRCUIT_BREAKER_ERROR
    );
  }
}

module.exports = ApiResponse;

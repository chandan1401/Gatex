const logger = require('../utils/logger');
const { CIRCUIT_BREAKER_STATES } = require('../utils/constants');
const config = require('../config/env');

class CircuitBreaker {
  constructor(options = {}) {
    this.state = CIRCUIT_BREAKER_STATES.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;

    this.threshold = options.threshold || config.circuitBreaker.threshold;
    this.timeout = options.timeout || config.circuitBreaker.timeout;
    this.resetTimeout = options.resetTimeout || config.circuitBreaker.resetTimeout;
    this.name = options.name || 'CircuitBreaker';
  }

  async call(fn) {
    if (this.state === CIRCUIT_BREAKER_STATES.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CIRCUIT_BREAKER_STATES.HALF_OPEN;
        logger.info(`${this.name} entering HALF_OPEN state`);
      } else {
        const error = new Error(`${this.name} is OPEN`);
        error.name = 'CircuitBreakerError';
        throw error;
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        this.createTimeout(),
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === CIRCUIT_BREAKER_STATES.HALF_OPEN) {
      this.state = CIRCUIT_BREAKER_STATES.CLOSED;
      this.successCount = 0;
      logger.info(`${this.name} circuit closed`);
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    logger.warn(`${this.name} failure count: ${this.failureCount}`);

    if (this.failureCount >= this.threshold) {
      this.state = CIRCUIT_BREAKER_STATES.OPEN;
      logger.error(`${this.name} circuit opened after ${this.failureCount} failures`);
    }
  }

  shouldAttemptReset() {
    return (
      this.lastFailureTime &&
      Date.now() - this.lastFailureTime >= this.resetTimeout
    );
  }

  createTimeout() {
    return new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error(`${this.name} timeout after ${this.timeout}ms`));
      }, this.timeout)
    );
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      threshold: this.threshold,
      lastFailureTime: this.lastFailureTime,
    };
  }

  reset() {
    this.state = CIRCUIT_BREAKER_STATES.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    logger.info(`${this.name} manually reset`);
  }
}

module.exports = CircuitBreaker;

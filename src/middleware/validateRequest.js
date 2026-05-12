const Joi = require('joi');
const ApiResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
          type: detail.type,
        }));

        logger.warn('Validation error', {
          path: req.path,
          source,
          errors,
        });

        return res
          .status(422)
          .json(ApiResponse.validationError(errors, 'Validation failed'));
      }

      req[source] = value;
      next();
    } catch (error) {
      logger.error('Validation middleware error:', error);
      res
        .status(500)
        .json(ApiResponse.error('Validation error occurred'));
    }
  };
};

const validateQuery = (schema) => validateRequest(schema, 'query');
const validateParams = (schema) => validateRequest(schema, 'params');
const validateBody = (schema) => validateRequest(schema, 'body');

module.exports = {
  validateRequest,
  validateQuery,
  validateParams,
  validateBody,
};

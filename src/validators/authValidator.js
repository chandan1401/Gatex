const Joi = require('joi');

const authValidator = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[0-9\-\+\(\)]{7,}$/).optional(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  confirmReset: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

const userValidator = {
  create: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('admin', 'user').default('user'),
    phone: Joi.string().optional(),
    avatar: Joi.string().uri().optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().optional(),
    avatar: Joi.string().uri().optional(),
    bio: Joi.string().max(500).optional(),
  }),

  updateRole: Joi.object({
    role: Joi.string().valid('admin', 'user').required(),
  }),

  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const orderValidator = {
  create: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
          price: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'upi').required(),
  }),

  update: Joi.object({
    status: Joi.string()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
      .optional(),
    shippingAddress: Joi.object().optional(),
  }),

  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    status: Joi.string().optional(),
  }),
};

const paymentValidator = {
  process: Joi.object({
    orderId: Joi.string().required(),
    amount: Joi.number().min(0.01).required(),
    currency: Joi.string().length(3).required(),
    method: Joi.string().valid('credit_card', 'debit_card', 'upi').required(),
    cardDetails: Joi.when('method', {
      is: Joi.string().valid('credit_card', 'debit_card'),
      then: Joi.object({
        cardNumber: Joi.string().creditCard().required(),
        expiryMonth: Joi.number().min(1).max(12).required(),
        expiryYear: Joi.number().min(new Date().getFullYear()).required(),
        cvv: Joi.string().pattern(/^[0-9]{3,4}$/).required(),
        cardholderName: Joi.string().required(),
      }).required(),
      otherwise: Joi.forbidden(),
    }),
  }),

  refund: Joi.object({
    transactionId: Joi.string().required(),
    reason: Joi.string().optional(),
  }),
};

module.exports = {
  authValidator,
  userValidator,
  orderValidator,
  paymentValidator,
};

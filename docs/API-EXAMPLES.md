# GateX API Examples

Complete examples for using the GateX API Gateway.

## Authentication Flows

### 1. Login & Get Access Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "user-123",
      "email": "user@example.com",
      "name": "Test User",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "24h"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Register New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "name": "New User",
    "phone": "+1234567890"
  }'
```

### 3. Refresh Access Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 4. Get Current User Info

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5. Logout

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## User Management

### Get All Users (Admin Only)

```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get User by ID

```bash
curl -X GET http://localhost:3000/api/v1/users/user-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update User

```bash
curl -X PUT http://localhost:3000/api/v1/users/user-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+1234567890",
    "bio": "User bio"
  }'
```

### Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:3000/api/v1/users/user-123 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Order Management

### Get User's Orders

```bash
curl -X GET "http://localhost:3000/api/v1/orders?page=1&limit=10&status=delivered" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Order

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-123",
        "quantity": 2,
        "price": 99.99
      },
      {
        "productId": "prod-456",
        "quantity": 1,
        "price": 49.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "credit_card"
  }'
```

### Get Order Details

```bash
curl -X GET http://localhost:3000/api/v1/orders/order-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Order

```bash
curl -X PUT http://localhost:3000/api/v1/orders/order-123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

### Cancel Order

```bash
curl -X POST http://localhost:3000/api/v1/orders/order-123/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Payment Processing

### Process Payment

```bash
curl -X POST http://localhost:3000/api/v1/payments/process \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-123",
    "amount": 149.98,
    "currency": "USD",
    "method": "credit_card",
    "cardDetails": {
      "cardNumber": "4111111111111111",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "cvv": "123",
      "cardholderName": "John Doe"
    }
  }'
```

### Get Transaction Details

```bash
curl -X GET http://localhost:3000/api/v1/payments/txn-123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Request Refund

```bash
curl -X POST http://localhost:3000/api/v1/payments/refund \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "txn-123",
    "reason": "Customer requested refund"
  }'
```

## Monitoring & Health

### Health Check

```bash
curl http://localhost:3000/health
```

### Gateway Metrics

```bash
curl http://localhost:3000/api/v1/monitoring/metrics
```

### Service Health Status

```bash
curl http://localhost:3000/api/v1/monitoring/health
```

### Prometheus Metrics

```bash
curl http://localhost:3000/metrics
```

## Cache Management

### Invalidate Cache Pattern

```bash
curl -X POST http://localhost:3000/api/v1/cache/invalidate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "orders:user-123:*"
  }'
```

### Clear All Cache

```bash
curl -X POST http://localhost:3000/api/v1/cache/clear \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## API Documentation

### View API Docs

```bash
curl http://localhost:3000/api-docs
```

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "errorType": "AUTHENTICATION_ERROR",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 422 Validation Error
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errorType": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email",
      "type": "string.email"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 429 Rate Limited
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests, please try again later",
  "errorType": "RATE_LIMIT_ERROR",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Advanced Examples

### Using Request ID for Tracing

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Request-ID: my-custom-request-id-12345" \
  -H "X-Trace-ID: my-trace-id-67890"
```

### Service-to-Service Communication

```bash
curl -X GET http://localhost:3000/api/v1/users/user-123 \
  -H "X-API-Key: gatex-api-key-prod-secret-key"
```

### Pagination Example

```bash
# Get page 2 with 20 items per page
curl -X GET "http://localhost:3000/api/v1/orders?page=2&limit=20&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## WebSocket Examples

### Connect to WebSocket

```javascript
// Client-side JavaScript
const socket = io('http://localhost:3005', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Subscribe to topic
socket.emit('subscribe', { topic: 'orders' });

// Listen for events
socket.on('order-created', (data) => {
  console.log('New order:', data);
});

// Handle disconnect
socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

## Response Format

All responses follow a standard format:

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* your data */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved",
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errorType": "ERROR_TYPE",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

For more information, see [README.md](../README.md)

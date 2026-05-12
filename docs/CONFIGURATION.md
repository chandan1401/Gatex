# Configuration Guide

Comprehensive guide for configuring GateX API Gateway.

## Environment Variables

### Server Configuration

```env
# Environment
NODE_ENV=development|production|testing

# Server
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=error|warn|info|debug|trace
```

### JWT Configuration

```env
# Access Token
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRY=24h|48h|7d

# Refresh Token
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRY=7d|30d
```

### Redis Configuration

```env
# Redis Connection
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=optional-password
REDIS_URL=redis://[user[:password]@]host[:port]/[db]

# Redis Connection Options
REDIS_RETRY_STRATEGY=true
REDIS_MAX_RETRIES=10
```

### MongoDB Configuration

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/gatex
MONGODB_USER=optional-user
MONGODB_PASSWORD=optional-password
MONGODB_REPLICASET=optional-replica-set
```

### Microservices URLs

```env
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
```

### Rate Limiting

```env
# Rate Limit Configuration
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100          # requests per window
RATE_LIMIT_ENABLE=true|false         # enable/disable rate limiting
RATE_LIMIT_KEY_PREFIX=api-limiter    # Redis key prefix
```

### Circuit Breaker

```env
# Circuit Breaker Configuration
CIRCUIT_BREAKER_THRESHOLD=5          # failures before opening
CIRCUIT_BREAKER_TIMEOUT=30000        # timeout in ms
CIRCUIT_BREAKER_RESET_TIMEOUT=60000  # reset timeout in ms
```

### Prometheus Monitoring

```env
# Prometheus Configuration
PROMETHEUS_ENABLED=true|false
PROMETHEUS_PORT=9090
PROMETHEUS_METRICS_PATH=/metrics
```

### Caching

```env
# Cache Configuration
CACHE_TTL=3600                   # default TTL in seconds
CACHE_ENABLED=true|false        # enable/disable caching
```

### CORS

```env
# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true|false
```

### Logging

```env
# Logging Configuration
LOG_DIR=./src/logs
LOG_MAX_SIZE=5242880          # 5MB
LOG_MAX_FILES=5               # retention
```

### WebSocket

```env
# WebSocket Configuration
WEBSOCKET_ENABLED=true|false
WEBSOCKET_PORT=3005
```

### Security

```env
# Security Configuration
HELMET_ENABLED=true|false
API_KEY_VALID=your-api-key-here
```

## Configuration File Structure

### config/env.js

```javascript
require('dotenv').config();

module.exports = {
  // Server
  node_env: 'development',
  port: 3000,
  host: 'localhost',
  
  // JWT
  jwt: {
    secret: 'your-secret-key',
    expiry: '24h',
  },
  
  // Redis
  redis: {
    host: 'localhost',
    port: 6379,
  },
  
  // ... other configs
};
```

## Production Configuration

### Environment Variables Example

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=warn

JWT_SECRET=your-production-secret-key-very-long-and-random
JWT_REFRESH_SECRET=your-production-refresh-secret-key-random

REDIS_HOST=redis-cluster.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-strong-password

MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gatex
MONGODB_USER=db-user
MONGODB_PASSWORD=db-password

AUTH_SERVICE_URL=https://auth.example.com
USER_SERVICE_URL=https://users.example.com
ORDER_SERVICE_URL=https://orders.example.com
PAYMENT_SERVICE_URL=https://payments.example.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090

CACHE_ENABLED=true
CACHE_TTL=3600

CORS_ORIGIN=https://example.com,https://app.example.com
CORS_CREDENTIALS=true

HELMET_ENABLED=true
API_KEY_VALID=your-production-api-key
```

## Docker Compose Configuration

### environment section

```yaml
services:
  api-gateway:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - REDIS_HOST=redis
      - MONGODB_URI=mongodb://mongo:27017/gatex
      - AUTH_SERVICE_URL=http://auth-service:3001
```

## Kubernetes Configuration

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-gateway-config
  namespace: gatex
data:
  NODE_ENV: production
  LOG_LEVEL: info
  RATE_LIMIT_MAX_REQUESTS: "1000"
```

### Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-gateway-secrets
  namespace: gatex
type: Opaque
stringData:
  JWT_SECRET: your-production-secret
  MONGODB_URI: mongodb+srv://user:pass@cluster/db
```

## Application Configuration Examples

### Minimal Configuration

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=minimum-secret-key-change-this
REDIS_HOST=localhost
MONGODB_URI=mongodb://localhost:27017/gatex
```

### Full Configuration

```env
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# JWT
JWT_SECRET=very-long-secret-key-for-production
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=refresh-secret-key
JWT_REFRESH_EXPIRY=7d

# Redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=redis-password

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster/db

# Microservices
AUTH_SERVICE_URL=http://auth-service:3001
USER_SERVICE_URL=http://user-service:3002
ORDER_SERVICE_URL=http://order-service:3003
PAYMENT_SERVICE_URL=http://payment-service:3004

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_ENABLE=true

# Circuit Breaker
CIRCUIT_BREAKER_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT=30000
CIRCUIT_BREAKER_RESET_TIMEOUT=60000

# Monitoring
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090

# Caching
CACHE_TTL=3600
CACHE_ENABLED=true

# CORS
CORS_ORIGIN=https://example.com,https://app.example.com
CORS_CREDENTIALS=true

# Logging
LOG_DIR=./logs

# WebSocket
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=3005

# Security
HELMET_ENABLED=true
API_KEY_VALID=your-api-key
```

## Configuration by Environment

### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
CACHE_ENABLED=false
RATE_LIMIT_ENABLE=false
CORS_ORIGIN=*
```

### Staging

```env
NODE_ENV=production
LOG_LEVEL=info
CACHE_ENABLED=true
RATE_LIMIT_ENABLE=true
PROMETHEUS_ENABLED=true
```

### Production

```env
NODE_ENV=production
LOG_LEVEL=warn
CACHE_ENABLED=true
RATE_LIMIT_ENABLE=true
RATE_LIMIT_MAX_REQUESTS=5000
PROMETHEUS_ENABLED=true
HELMET_ENABLED=true
```

## Advanced Configuration

### Custom Rate Limit Rules

Modify `src/middleware/rateLimiter.js`:

```javascript
const customRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,        // 1 minute
  max: 50,                     // 50 requests
  keyPrefix: 'custom-limit',
});
```

### Custom Circuit Breaker Settings

Modify `src/services/proxyService.js`:

```javascript
const breaker = new CircuitBreaker({
  threshold: 10,
  timeout: 60000,
  resetTimeout: 120000,
  name: 'CustomService'
});
```

### Custom Cache Settings

Modify `src/services/cacheService.js`:

```javascript
const cache = new CacheService({
  ttl: 1800,                   // 30 minutes
  prefix: 'gatex:cache:',
  compression: true,
});
```

## Validation & Testing

### Validate Configuration

```bash
node -e "require('./src/config/env.js'); console.log('✓ Config valid')"
```

### Test Connections

```bash
# Test Redis
redis-cli ping

# Test MongoDB
mongosh mongodb://localhost:27017/gatex

# Test service URLs
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

## Environment File Template

```env
# Copy this template and fill in your values
# Save as .env

# ============== SERVER ==============
NODE_ENV=development
PORT=3000
HOST=localhost
LOG_LEVEL=info

# ============== JWT ==============
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRY=7d

# ============== REDIS ==============
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# ============== MONGODB ==============
MONGODB_URI=mongodb://localhost:27017/gatex
MONGODB_USER=
MONGODB_PASSWORD=

# ============== MICROSERVICES ==============
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004

# ============== RATE LIMITING ==============
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_ENABLE=true

# ============== CIRCUIT BREAKER ==============
CIRCUIT_BREAKER_THRESHOLD=5
CIRCUIT_BREAKER_TIMEOUT=30000
CIRCUIT_BREAKER_RESET_TIMEOUT=60000

# ============== MONITORING ==============
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090

# ============== CACHING ==============
CACHE_TTL=3600
CACHE_ENABLED=true

# ============== CORS ==============
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# ============== WEBSOCKET ==============
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=3005

# ============== SECURITY ==============
HELMET_ENABLED=true
API_KEY_VALID=gatex-api-key-prod-secret-key
```

---

For more information, see [README.md](../README.md)

# GateX - Production-Grade API Gateway

A scalable, secure API Gateway system built with Node.js, Express.js, Redis, MongoDB, Docker, and Kubernetes. Inspired by production systems used by Netflix, Amazon, Uber, and Swiggy.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### Core Features
- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **Role-Based Access Control (RBAC)** - Admin, User, Service, Guest roles
- ✅ **API Key Validation** - Service-to-service authentication
- ✅ **Request Routing** - Dynamic routing to multiple microservices
- ✅ **Rate Limiting** - Redis-based rate limiter with IP tracking
- ✅ **Caching Layer** - Redis caching with TTL support
- ✅ **Load Balancing** - Round-robin and weighted round-robin algorithms
- ✅ **Circuit Breaker** - Fault tolerance and resilience
- ✅ **Request/Response Logging** - Winston logger with request ID tracking
- ✅ **Error Handling** - Centralized error middleware with standardized responses
- ✅ **CORS Protection** - Configurable CORS middleware
- ✅ **Input Validation** - Joi schema validation
- ✅ **Helmet.js Security** - HTTP headers security

### Monitoring & Observability
- 📊 **Prometheus Metrics** - Detailed metrics collection
- 📈 **Grafana Dashboards** - Real-time visualization
- 🔍 **Request Tracing** - Request ID and trace ID tracking
- 📝 **Structured Logging** - Pino JSON logging
- ⚙️ **Health Checks** - Comprehensive health endpoints

### Infrastructure
- 🐳 **Docker Support** - Multi-stage builds with optimization
- 🐳 **Docker Compose** - Complete stack orchestration
- ☸️ **Kubernetes Ready** - Full K8s manifests with HPA
- 🔄 **Auto-scaling** - Horizontal pod autoscaling
- 📡 **WebSocket Support** - Real-time communication with Socket.IO
- 🌐 **NGINX Reverse Proxy** - SSL/TLS termination

### Advanced Features
- 🔗 **Circuit Breaker Pattern** - Automatic failure recovery
- 🔀 **Service Discovery** - Dynamic service routing
- 📦 **Microservices** - 4 sample microservices included
- 🧪 **Testing** - Jest + Supertest setup
- 📚 **API Documentation** - Built-in endpoint documentation

## 📋 Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Cache | Redis 7.x |
| Database | MongoDB 6.x |
| HTTP Proxy | http-proxy |
| Authentication | JWT + bcryptjs |
| Logging | Pino |
| Metrics | Prometheus |
| Visualization | Grafana |
| WebSocket | Socket.IO |
| Security | Helmet.js |
| Validation | Joi |
| Container | Docker |
| Orchestration | Docker Compose, Kubernetes |
| Testing | Jest, Supertest |

## 📁 Project Structure

```
api-gateway/
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.js          # Environment variables
│   │   ├── redis.js        # Redis client
│   │   └── db.js           # MongoDB connection
│   ├── middleware/          # Express middleware
│   │   ├── auth.js         # Authentication/Authorization
│   │   ├── rateLimiter.js  # Rate limiting
│   │   ├── errorHandler.js # Error handling
│   │   ├── validateRequest.js
│   │   ├── logger.js       # Request logging
│   │   └── cors.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── services/            # Business logic
│   │   ├── proxyService.js    # HTTP proxy
│   │   ├── authService.js     # Authentication
│   │   ├── cacheService.js    # Caching
│   │   └── monitoringService.js
│   ├── utils/               # Utilities
│   │   ├── constants.js
│   │   ├── logger.js
│   │   ├── jwt.js
│   │   ├── requestId.js
│   │   └── responseFormatter.js
│   ├── cache/               # Cache implementation
│   ├── circuitbreaker/      # Fault tolerance
│   ├── loadbalancer/        # Load balancing
│   ├── monitoring/          # Metrics
│   ├── validators/          # Input validation
│   ├── websocket/           # WebSocket server
│   ├── app.js              # Express app
│   └── server.js           # Server entry point
├── tests/                   # Test files
├── microservices/           # Sample microservices
│   ├── auth-service/
│   ├── user-service/
│   ├── order-service/
│   └── payment-service/
├── kubernetes/              # K8s manifests
├── nginx/                   # NGINX config
├── monitoring/              # Prometheus config
├── docker-compose.yml
├── Dockerfile
├── package.json
├── .env
├── jest.config.js
├── .eslintrc.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Local Development

1. **Clone and setup**
```bash
cd api-gateway
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start services with Docker Compose**
```bash
docker-compose up -d
```

4. **Start API Gateway**
```bash
npm run dev
```

5. **Access endpoints**
- API Gateway: http://localhost:3000
- Health Check: http://localhost:3000/health
- Metrics: http://localhost:3000/metrics
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

### Docker Development

```bash
# Build image
docker build -t gatex-api-gateway:latest .

# Run container
docker run -p 3000:3000 \
  -e REDIS_HOST=host.docker.internal \
  gatex-api-gateway:latest
```

### Docker Compose (Full Stack)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api-gateway

# Stop services
docker-compose down
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/login           # Login
POST   /api/v1/auth/register        # Register
POST   /api/v1/auth/refresh-token   # Refresh token
POST   /api/v1/auth/logout          # Logout
GET    /api/v1/auth/me              # Get current user
POST   /api/v1/auth/change-password # Change password
```

### Users
```
GET    /api/v1/users                # Get all users (admin)
GET    /api/v1/users/:userId        # Get user by ID
PUT    /api/v1/users/:userId        # Update user
DELETE /api/v1/users/:userId        # Delete user (admin)
```

### Orders
```
GET    /api/v1/orders               # Get user's orders
POST   /api/v1/orders               # Create order
GET    /api/v1/orders/:orderId      # Get order details
PUT    /api/v1/orders/:orderId      # Update order
POST   /api/v1/orders/:orderId/cancel # Cancel order
```

### Payments
```
POST   /api/v1/payments/process     # Process payment
GET    /api/v1/payments/:transactionId # Get transaction
POST   /api/v1/payments/refund      # Refund payment
```

### Monitoring
```
GET    /health                      # Health check
GET    /metrics                     # Prometheus metrics
GET    /api/v1/monitoring/metrics   # Gateway metrics
GET    /api/v1/monitoring/health    # Service health
GET    /api-docs                    # API documentation
```

### Cache Management
```
POST   /api/v1/cache/invalidate     # Invalidate cache pattern
POST   /api/v1/cache/clear          # Clear all cache
```

## 🔐 Authentication Example

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Response
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
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": "24h"
    }
  }
}
```

### Use Token
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📊 Monitoring

### Prometheus Metrics
Available at `http://localhost:9090`

Key metrics:
- `gateway_total_requests` - Total requests counter
- `gateway_request_duration_seconds` - Request latency histogram
- `gateway_active_connections` - Active connection gauge
- `gateway_total_errors` - Error counter
- `gateway_circuit_breaker_state` - Circuit breaker state

### Grafana Dashboards
Available at `http://localhost:3001`

Default credentials: `admin:admin`

### Health Checks
```bash
curl http://localhost:3000/health
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, EKS, GKE, AKS)
- kubectl configured
- Docker images pushed to registry

### Deploy to Kubernetes

1. **Build and push images**
```bash
docker build -t your-registry/gatex-api-gateway:1.0.0 .
docker push your-registry/gatex-api-gateway:1.0.0
```

2. **Update image in manifests**
```bash
# Edit kubernetes/*.yml files
```

3. **Apply manifests**
```bash
kubectl apply -f kubernetes/
```

4. **Verify deployment**
```bash
kubectl get pods -n gatex
kubectl get svc -n gatex
kubectl logs -n gatex deployment/api-gateway
```

5. **Port forward for local access**
```bash
kubectl port-forward -n gatex svc/api-gateway 3000:80
```

### Kubernetes Features Included
- Rolling updates
- Horizontal Pod Autoscaling (HPA)
- Pod Disruption Budgets (PDB)
- Health checks (liveness & readiness probes)
- Resource limits and requests
- StatefulSets for databases

## 🔧 Environment Configuration

Create `.env` file:

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost
LOG_LEVEL=info

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRY=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gatex

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Microservices
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004

# Prometheus
PROMETHEUS_ENABLED=true

# WebSocket
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=3005

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## 📚 API Documentation

View interactive documentation at `http://localhost:3000/api-docs`

## 🛠️ Development

### Code Style
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Building
```bash
# Development
npm run dev

# Production
npm start
```

## 🐛 Troubleshooting

### Redis Connection Issues
```bash
# Check Redis connectivity
redis-cli -h localhost -p 6379 ping
```

### MongoDB Connection Issues
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/gatex
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker Issues
```bash
# Clean up Docker
docker system prune -a

# Rebuild images
docker-compose build --no-cache
```

## 📈 Performance Tips

1. **Enable Caching**
   - Set `CACHE_ENABLED=true` in `.env`
   - Configure cache TTL appropriately

2. **Optimize Rate Limiting**
   - Adjust `RATE_LIMIT_MAX_REQUESTS` based on capacity
   - Use Redis for distributed rate limiting

3. **Database Indexing**
   - Create indexes on frequently queried fields
   - Monitor query performance

4. **Connection Pooling**
   - Configure Redis connection pool
   - Optimize MongoDB connection pool

5. **Container Resources**
   - Set appropriate CPU/memory limits
   - Monitor resource usage with Prometheus

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets (min 32 characters)
   - Rotate keys regularly

2. **HTTPS/TLS**
   - Enable SSL certificates in NGINX
   - Use HSTS headers

3. **API Key Management**
   - Rotate API keys periodically
   - Use different keys for different services

4. **Rate Limiting**
   - Configure per-endpoint limits
   - Monitor for suspicious activity

5. **Input Validation**
   - Always validate user input
   - Use Joi schemas

6. **Logging**
   - Don't log sensitive data
   - Monitor logs for security events

## 📊 Scaling Strategies

### Horizontal Scaling
```bash
# Docker Compose
docker-compose up -d --scale api-gateway=3

# Kubernetes
kubectl scale deployment api-gateway -n gatex --replicas=5
```

### Database Scaling
- Use MongoDB replication
- Implement sharding for large datasets
- Consider read replicas

### Cache Optimization
- Implement cache warming
- Use multi-tier caching strategy
- Monitor cache hit rates

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file

## 📞 Support

- Documentation: Check `/docs` folder
- Issues: GitHub Issues
- Email: support@gatex.dev

## 🎯 Roadmap

- [ ] GraphQL Gateway support
- [ ] Service mesh integration (Istio)
- [ ] Distributed tracing (Jaeger)
- [ ] Event streaming (Kafka/RabbitMQ)
- [ ] Advanced analytics dashboard
- [ ] Canary deployment support
- [ ] API versioning management
- [ ] Multi-region deployment

## 👨‍💻 Author

**GateX Team**

## 🙏 Acknowledgments

Inspired by production systems from Netflix, Amazon, Uber, and Swiggy.

---

Made with ❤️ by the GateX Team

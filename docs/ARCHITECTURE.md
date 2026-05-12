# GateX API Gateway - Architecture Documentation

## System Overview

GateX is a production-grade API Gateway that serves as the single entry point for multiple backend microservices. It implements industry best practices from companies like Netflix, Amazon, Uber, and Swiggy.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Clients                                  │
│                    (Web, Mobile, Desktop)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │    NGINX       │
                    │  (SSL/TLS)     │
                    │  Load Balancer │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼──────┐    ┌───────▼──────┐    ┌──────▼──────┐
    │  Gateway │    │  Gateway     │    │  Gateway    │
    │ Instance │    │ Instance     │    │ Instance    │
    │    #1    │    │    #2        │    │    #3       │
    └───┬──────┘    └───────┬──────┘    └──────┬──────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
    ┌───▼─────────┐              ┌────────────▼────┐
    │    Redis    │              │    MongoDB      │
    │   (Cache)   │              │   (Persistent)  │
    └─────────────┘              └─────────────────┘
        │
    ┌───┴────────────────────────────────┐
    │                                    │
┌───▼──────────┐  ┌─────────┐  ┌────────▼───────┐
│ Auth Service │  │ Rate    │  │ Circuit Breaker│
│   :3001      │  │Limiter  │  │  & Monitoring  │
└──────────────┘  └─────────┘  └────────────────┘
    │
    ├─► User Service :3002
    ├─► Order Service :3003
    └─► Payment Service :3004
```

## Key Components

### 1. **Request Pipeline**

```
Client Request
    │
    ├─► CORS Middleware
    ├─► Request ID Generation
    ├─► Authentication Check
    ├─► Rate Limiting Check
    ├─► Input Validation
    ├─► Cache Check
    ├─► Proxy to Microservice
    ├─► Response Formatting
    ├─► Cache Storage
    └─► Response to Client
```

### 2. **Authentication Flow**

```
User Credentials
    │
    ├─► Validate Input
    ├─► Check if user blocked
    ├─► Verify credentials
    ├─► Generate Access Token (JWT)
    ├─► Generate Refresh Token
    ├─► Store Refresh Token in Redis
    └─► Return Tokens to Client

Subsequent Requests:
    │
    ├─► Extract Token from Header
    ├─► Verify JWT Signature
    ├─► Check Token Expiry
    ├─► Extract User Claims
    └─► Allow/Deny Request
```

### 3. **Rate Limiting Strategy**

```
Request Arrives
    │
    ├─► Extract Client IP
    ├─► Create Redis Key: "rate-limit:{ip}"
    ├─► Increment Counter
    ├─► Check Against Limit
    │   ├─► If OK → Continue
    │   └─► If Exceeded → Return 429
    └─► Set Expiry Time
```

### 4. **Caching Strategy**

```
GET Request
    │
    ├─► Generate Cache Key
    ├─► Check Redis Cache
    │   ├─► Cache Hit → Return Cached Response
    │   └─► Cache Miss → Continue
    │
    ├─► Proxy to Service
    ├─► Intercept Response
    ├─► Store in Redis (with TTL)
    └─► Return to Client

POST/PUT/DELETE → Invalidate Related Caches
```

### 5. **Circuit Breaker Pattern**

```
Service Call Attempt
    │
    ├─► Check Circuit State
    │   ├─► CLOSED (Normal)
    │   │   ├─► Increment failure count if fails
    │   │   └─► Check if threshold exceeded
    │   │
    │   ├─► OPEN (Blocked)
    │   │   └─► Check if reset timeout passed
    │   │
    │   └─► HALF_OPEN (Testing)
    │       ├─► Allow request through
    │       ├─► If succeeds → CLOSED
    │       └─► If fails → OPEN
```

## Microservices Architecture

### Service Catalog

```
┌─────────────────────────────────────┐
│  API Gateway (Single Entry Point)   │
│  - Authentication                   │
│  - Rate Limiting                    │
│  - Routing                          │
│  - Monitoring                       │
└────────────┬────────────────────────┘
             │
    ┌────────┼────────┬──────────┐
    │        │        │          │
┌───▼──┐ ┌──▼──┐ ┌───▼───┐ ┌───▼─────┐
│ Auth │ │User │ │Order  │ │Payment  │
│  :01 │ │ :02 │ │ :03   │ │  :04    │
└──────┘ └─────┘ └───────┘ └─────────┘
```

### Service Responsibilities

| Service | Port | Responsibilities |
|---------|------|------------------|
| Auth    | 3001 | User authentication, JWT generation |
| User    | 3002 | User profile management |
| Order   | 3003 | Order creation and management |
| Payment | 3004 | Payment processing |

## Data Flow Examples

### Example 1: User Login

```
1. Client → POST /api/v1/auth/login
2. Gateway receives request
3. Validate input schema
4. Check if user blocked (Redis)
5. Proxy to Auth Service
6. Auth Service validates credentials
7. Generate JWT tokens
8. Store refresh token in Redis
9. Return tokens to client
```

### Example 2: Create Order

```
1. Client → POST /api/v1/orders (with JWT)
2. Gateway extracts and verifies JWT
3. Check rate limit (Redis)
4. Validate order schema
5. Check cache (if applicable)
6. Proxy to Order Service
7. Order Service creates order in MongoDB
8. Invalidate related cache patterns
9. Return created order to client
10. Store metrics in Prometheus
```

### Example 3: Process Payment

```
1. Client → POST /api/v1/payments/process (with JWT)
2. Gateway extracts and verifies JWT
3. Circuit breaker check for Payment Service
4. Validate payment schema
5. Proxy to Payment Service
6. Payment Service processes payment
7. If fails → Circuit breaker tracks failure
8. Return status to client
9. Update metrics
10. Log transaction
```

## Scaling Architecture

### Horizontal Scaling

```
Load Balancer (NGINX)
    │
    ├─► API Gateway Instance 1
    ├─► API Gateway Instance 2
    ├─► API Gateway Instance 3
    └─► API Gateway Instance N

All instances share:
- Redis Cache (single or cluster)
- MongoDB Database (single or replica set)
- Configuration (environment variables)
```

### Vertical Scaling

```
Increase per instance:
- CPU allocation
- Memory allocation
- Connection pool size
- Worker processes
```

### Database Scaling

```
MongoDB Options:
- Replica Sets (high availability)
- Sharding (horizontal partitioning)
- Read replicas (distributed reads)

Redis Options:
- Sentinel (automatic failover)
- Redis Cluster (distributed cache)
- Read replicas (caching layers)
```

## Security Architecture

```
┌────────────────────────────────────────────┐
│         External Clients                   │
└────────────────────┬───────────────────────┘
                     │
            HTTPS / TLS Layer (NGINX)
                     │
        ┌────────────▼──────────────┐
        │ Rate Limiting Middleware   │ ─► Block suspicious IPs
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────┐
        │ Authentication Middleware  │ ─► Verify JWT
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────┐
        │ Input Validation          │ ─► Joi schemas
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────┐
        │ CORS Middleware           │ ─► Whitelist origins
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────┐
        │ Helmet.js Security Headers │ ─► XSS protection
        └────────────┬───────────────┘
                     │
            ┌────────▼────────┐
            │ Microservices   │
            │ (Internal Only) │
            └─────────────────┘
```

## Monitoring Architecture

```
┌─────────────────────────────────────┐
│       Application Metrics           │
│ - Request count                     │
│ - Response time                     │
│ - Error rate                        │
│ - Circuit breaker state             │
│ - Cache hit rate                    │
└────────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │    Prometheus       │ (Metrics Store)
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────┐
    │      Grafana        │ (Visualization)
    │   - Dashboards      │
    │   - Alerts          │
    └─────────────────────┘

Logging Flow:
    │
    ├─► Winston Logger
    ├─► Pino (structured logs)
    ├─► JSON format
    └─► File/Cloud storage
```

## Deployment Architecture

### Docker Compose

```
docker-compose.yml
├── api-gateway (3 instances possible)
├── redis (single or cluster)
├── mongo (single or replica)
├── prometheus
├── grafana
├── auth-service
├── user-service
├── order-service
├── payment-service
└── nginx (reverse proxy)
```

### Kubernetes

```
API Gateway Deployment:
├── Namespace: gatex
├── Deployment: api-gateway (3 replicas)
├── Service: api-gateway (LoadBalancer)
├── HPA: auto-scale 2-10 replicas
├── PDB: min 1 available pod
│
StatefulSets:
├── Redis: 1 pod with PersistentVolume
├── MongoDB: 1 pod with PersistentVolume
│
Microservices Deployments:
├── auth-service (replica set)
├── user-service (replica set)
├── order-service (replica set)
└── payment-service (replica set)
│
Monitoring:
├── Prometheus deployment
└── Grafana deployment
```

## Performance Optimization Strategies

### 1. Caching Layers

```
L1 Cache: Response Cache (Redis) - 1 hour TTL
L2 Cache: Query Cache (Redis) - 30 min TTL
L3 Cache: Browser Cache - static assets
```

### 2. Connection Pooling

```
- Redis Connection Pool: 10-50 connections
- MongoDB Connection Pool: 10-100 connections
- HTTP Agent Pool: reuse TCP connections
```

### 3. Request Compression

```
Gzip compression for:
- JSON responses
- Text responses
- Large payloads (>1KB)
```

### 4. Database Optimization

```
Indexes on:
- userId (frequent queries)
- orderId (order lookups)
- createdAt (sorting)
- status (filtering)
```

## Error Handling Strategy

```
Error Occurs
    │
    ├─► Categorize Error
    │   ├─► Validation Error → 422
    │   ├─► Auth Error → 401
    │   ├─► Permission Error → 403
    │   ├─► Not Found → 404
    │   ├─► Rate Limited → 429
    │   ├─► Service Error → 503
    │   └─► Server Error → 500
    │
    ├─► Log Error with context
    │   ├─► Request ID
    │   ├─► User ID
    │   ├─► Error trace
    │   └─► Timestamp
    │
    ├─► Format Error Response
    └─► Return to Client
```

## Testing Strategy

```
Unit Tests:
├─ Utility functions
├─ Service methods
└─ Middleware logic

Integration Tests:
├─ Auth flow
├─ Request routing
├─ Rate limiting
└─ Caching behavior

End-to-End Tests:
├─ Complete API flows
├─ Error scenarios
└─ Edge cases

Load Tests:
├─ Concurrency testing
├─ Rate limit validation
└─ Failure scenarios
```

## Summary

GateX provides a robust, scalable API Gateway architecture that:
- Routes requests efficiently to microservices
- Implements enterprise security patterns
- Provides comprehensive monitoring and observability
- Scales horizontally and vertically
- Maintains high availability and fault tolerance
- Follows industry best practices

---

For more information, see [README.md](../README.md)

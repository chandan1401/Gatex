# GateX Dashboard - API Integration Guide

## Overview

The GateX Dashboard frontend integrates with the backend API through a centralized Axios client with automatic JWT token management, request/response interceptors, and comprehensive error handling.

## API Client Architecture

### Main API Client (`src/services/api.js`)

```javascript
// Base Configuration
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
// - Automatically injects JWT token from localStorage
// - Sets Authorization header for authenticated endpoints

// Response Interceptor
// - Handles 401 responses (token expired/invalid)
// - Redirects to login page
// - Retries request with refreshed token
```

## API Endpoints Reference

### Authentication Endpoints

#### Login
```javascript
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, email, name, role } }

Usage:
const response = await authAPI.login({ 
  email: 'admin@gatex.com', 
  password: 'password' 
})
```

#### Register
```javascript
POST /api/auth/register
Body: { email, password, name }
Response: { token, user: { id, email, name } }
```

#### Refresh Token
```javascript
POST /api/auth/refresh-token
Body: { token }
Response: { token }

// Auto-called on 401 errors
```

#### Get Current User
```javascript
GET /api/auth/me
Response: { id, email, name, role, permissions }
```

#### Logout
```javascript
POST /api/auth/logout
Response: { success: true }
```

### User Management

```javascript
// Get all users
GET /api/users
Response: [{ id, email, name, role, status }]

// Get user by ID
GET /api/users/:id
Response: { id, email, name, role, createdAt }

// Create user
POST /api/users
Body: { email, password, name, role }
Response: { id, email, name }

// Update user
PUT /api/users/:id
Body: { name, role, status }
Response: { id, email, name, role }

// Delete user
DELETE /api/users/:id
Response: { success: true }
```

### Metrics & Monitoring

```javascript
// Get current metrics
GET /api/metrics
Response: {
  requests: { total, successRate, errorRate },
  performance: { avgResponseTime, p95, p99 },
  resources: { cpu, memory, diskIO }
}

// Get health status
GET /api/health
Response: {
  status: 'healthy',
  services: [
    { name: 'api', status: 'up' },
    { name: 'database', status: 'up' }
  ]
}

// Get cache statistics
GET /api/cache/stats
Response: {
  hitRate: 0.87,
  missRate: 0.13,
  memoryUsed: 512,
  memoryTotal: 1024,
  keys: 12345
}

// Clear cache
POST /api/cache/clear
Response: { keysCleared: 12345 }
```

### Real-time Events (WebSocket)

```javascript
// Connection
const socket = io(process.env.VITE_WS_URL)

// Received Events
socket.on('metrics:update', (data) => {
  // { requests, response_time, errors }
})

socket.on('log:new', (log) => {
  // { id, timestamp, method, path, status, duration }
})

socket.on('traffic:update', (data) => {
  // { timestamp, requests, errors }
})

socket.on('service:status', (data) => {
  // { service, status, uptime, responseTime }
})

socket.on('ratelimit:alert', (data) => {
  // { ip, requests, limit, severity }
})

socket.on('redis:alert', (data) => {
  // { type, memory, evicted }
})

socket.on('kafka:event', (event) => {
  // { topic, partition, offset, timestamp }
})

// Emit Events
socket.emit('subscribe:metrics', { interval: 5000 })
socket.emit('subscribe:logs', { filter: 'errors' })
```

## Frontend Implementation

### Using API Services

```jsx
// Authentication
import { authAPI } from './services/api'

async function handleLogin(email, password) {
  try {
    const response = await authAPI.login({ email, password })
    // Handle success
  } catch (error) {
    // Handle error
  }
}

// Users
import { userAPI } from './services/api'

async function loadUsers() {
  const response = await userAPI.getAll()
  setUsers(response.data)
}

// Metrics
import { metricsAPI } from './services/api'

async function loadMetrics() {
  const response = await metricsAPI.getMetrics()
  return response.data
}
```

### Real-time Socket Integration

```jsx
import { useEffect } from 'react'
import { onMetricsUpdate, onLogUpdate } from './services/socket'

function Dashboard() {
  useEffect(() => {
    // Listen for metrics updates
    const unsubscribe = onMetricsUpdate((metrics) => {
      console.log('Updated metrics:', metrics)
      setMetrics(metrics)
    })

    // Listen for new logs
    const unsubscribeLogs = onLogUpdate((log) => {
      console.log('New log:', log)
      addLog(log)
    })

    // Cleanup
    return () => {
      unsubscribe()
      unsubscribeLogs()
    }
  }, [])

  return <div>Dashboard</div>
}
```

## Error Handling

### Global Error Handler

```javascript
// Response interceptor catches all errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
    } else if (error.response?.status === 403) {
      // Permission denied
    } else if (error.response?.status >= 500) {
      // Server error
    }
    return Promise.reject(error)
  }
)
```

### Component-level Error Handling

```jsx
import { useNotification } from './context/NotificationContext'

function MyComponent() {
  const { error, success } = useNotification()

  async function loadData() {
    try {
      const response = await metricsAPI.getMetrics()
      success('Data loaded!')
      return response.data
    } catch (err) {
      error(`Failed to load data: ${err.message}`)
    }
  }

  return <button onClick={loadData}>Load Data</button>
}
```

## Data Caching

### Implementing Client-side Caching

```jsx
import { useLocalStorage } from './hooks/useCustomHooks'

function MetricsComponent() {
  const [cachedMetrics, setCachedMetrics] = useLocalStorage('metrics', null)
  const [lastUpdate, setLastUpdate] = useLocalStorage('metricsUpdate', 0)

  useEffect(() => {
    const now = Date.now()
    const shouldRefresh = !cachedMetrics || (now - lastUpdate) > 60000

    if (shouldRefresh) {
      metricsAPI.getMetrics().then(res => {
        setCachedMetrics(res.data)
        setLastUpdate(now)
      })
    } else {
      setMetrics(cachedMetrics)
    }
  }, [])

  return <div>{/* Display metrics */}</div>
}
```

## Request Optimization

### Batch Requests

```javascript
// Make multiple requests in parallel
const [users, metrics, health] = await Promise.all([
  userAPI.getAll(),
  metricsAPI.getMetrics(),
  metricsAPI.getHealthCheck(),
])
```

### Request Pagination

```javascript
// Paginated request
async function loadUsers(page = 1, limit = 20) {
  const response = await apiClient.get('/users', {
    params: { page, limit }
  })
  return response.data
}
```

### Query Parameters

```javascript
// Filtered request
async function searchLogs(query, limit = 100) {
  const response = await apiClient.get('/logs', {
    params: {
      search: query,
      limit,
      sort: '-timestamp'
    }
  })
  return response.data
}
```

## Authentication Flow

```
┌─────────────┐
│   Login     │
│  Page       │
└──────┬──────┘
       │ Submit email/password
       ▼
┌─────────────────────────────┐
│  /api/auth/login            │
│  POST { email, password }   │
└──────┬──────────────────────┘
       │ Returns { token, user }
       ▼
┌──────────────────────────────┐
│  Store token in localStorage │
│  Redirect to /dashboard      │
└──────────────────────────────┘
       │
       │ All subsequent requests
       ▼
┌──────────────────────────────┐
│ Axios Interceptor            │
│ Add Authorization: Bearer    │
└──────────────────────────────┘
       │
       │ On 401 response
       ▼
┌──────────────────────────────┐
│ /api/auth/refresh-token      │
│ POST { token }               │
└──────┬───────────────────────┘
       │ Returns new { token }
       ▼
┌──────────────────────────────┐
│  Update token in localStorage│
│  Retry original request      │
└──────────────────────────────┘
```

## CORS Configuration

The backend must have CORS enabled:

```javascript
// Backend (Node.js/Express example)
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

## WebSocket Configuration

### Connection with Authentication

```javascript
// src/services/socket.js
import io from 'socket.io-client'

const socket = io(
  process.env.VITE_WS_URL,
  {
    auth: {
      token: localStorage.getItem('token')
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  }
)
```

### Event Patterns

```javascript
// Subscribe to namespace
socket.on('connect', () => {
  socket.emit('subscribe', { channel: 'metrics' })
})

// Listen for updates
socket.on('metrics:update', (data) => {
  console.log('Metrics:', data)
})

// Unsubscribe
socket.on('disconnect', () => {
  console.log('Disconnected')
})
```

## Testing API Integration

### Postman Collection

Import the provided Postman collection:

```bash
# File: GateX-API.postman_collection.json
# Location: ./docs/postman/

1. Import collection
2. Set environment variables:
   - base_url: http://localhost:3000
   - token: <jwt_token>
3. Run requests
```

### Manual Testing

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gatex.com","password":"password"}'

# Get metrics (with token)
curl http://localhost:3000/api/metrics \
  -H "Authorization: Bearer <token>"
```

## Performance Optimization

### Request Debouncing

```jsx
import { useDebounce } from './hooks/useCustomHooks'

function SearchLogs() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      metricsAPI.searchLogs(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input onChange={e => setQuery(e.target.value)} />
}
```

### Response Caching

```javascript
// Axios cache adapter
const axiosCache = new AxiosCacheAdapter({
  maxAge: 5 * 60 * 1000 // 5 minutes
})

apiClient.defaults.adapter = axiosCache
```

## Troubleshooting

### CORS Errors

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check backend CORS configuration
2. Verify allowed origins in backend
3. Ensure credentials are sent if needed

### 401 Unauthorized

**Problem**: Requests return 401 Unauthorized

**Solution**:
1. Check token is stored in localStorage
2. Verify token hasn't expired
3. Try logging in again
4. Check token format in Authorization header

### WebSocket Connection Failed

**Problem**: `WebSocket is closed`

**Solution**:
1. Verify backend WebSocket server is running
2. Check WS port is accessible
3. Verify authentication token
4. Check firewall settings

### Request Timeout

**Problem**: Requests hang or timeout

**Solution**:
1. Increase timeout in apiClient config
2. Check backend is responding
3. Monitor network tab for slow responses
4. Implement retry logic

## API Versioning

Future versions will support API v2:

```javascript
// Current (v1)
const apiClient = axios.create({
  baseURL: 'http://localhost:3000'
})

// Future (v2)
const apiV2 = axios.create({
  baseURL: 'http://localhost:3000/api/v2'
})
```

## Rate Limiting

The API enforces rate limits:

```
- 1000 requests per minute per IP
- 100 requests per minute per user
- WebSocket: 100 messages per minute
```

Headers indicate rate limit status:

```javascript
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

For more information, refer to [README.md](./README.md) or the backend API documentation.

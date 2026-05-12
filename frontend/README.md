# GateX Dashboard Frontend - Comprehensive Guide

## 🎯 Overview

GateX Dashboard is a production-grade monitoring and analytics frontend for the GateX API Gateway. Built with React, Vite, Tailwind CSS, and Framer Motion, it provides enterprise-level real-time visualization of your API infrastructure.

## 📊 Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React.js | 18.2.0 |
| **Build Tool** | Vite | 4.4.0 |
| **Styling** | Tailwind CSS | 3.3.2 |
| **Animations** | Framer Motion | 10.13.0 |
| **Charts** | Recharts | 2.7.0 |
| **HTTP Client** | Axios | 1.4.0 |
| **Real-time** | Socket.IO Client | 4.7.0 |
| **Routing** | React Router | 6.14.0 |
| **Icons** | Lucide React | 0.263.0 |

## 🚀 Quick Start

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access Dashboard

- **Development**: http://localhost:5173
- **Login Credentials**:
  - Email: `admin@gatex.com`
  - Password: `password`

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── TopBar.jsx          # Header with user menu
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── CommonComponents.jsx # Reusable UI components
│   │   ├── Charts.jsx          # Chart components
│   │   ├── NotificationCenter.jsx # Toast notifications
│   │   └── ProtectedRoute.jsx  # Route protection
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx       # Authentication
│   │   ├── DashboardPage.jsx   # Main dashboard
│   │   ├── LogsPage.jsx        # Request logs
│   │   ├── APITestingPage.jsx  # API testing console
│   │   ├── RedisPage.jsx       # Redis monitoring
│   │   ├── TrafficPage.jsx     # Traffic analytics
│   │   ├── RateLimiterPage.jsx # Rate limiting
│   │   ├── KubernetesPage.jsx  # K8s monitoring
│   │   ├── KafkaPage.jsx       # Kafka events
│   │   ├── WebSocketPage.jsx   # WebSocket monitoring
│   │   ├── ServicesPage.jsx    # Service discovery
│   │   ├── AnalyticsPage.jsx   # Analytics
│   │   └── SettingsPage.jsx    # Settings
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── NotificationContext.jsx # Notifications state
│   │
│   ├── services/
│   │   ├── api.js              # Axios API client
│   │   └── socket.js           # Socket.IO client
│   │
│   ├── hooks/
│   │   ├── useCustomHooks.js   # Custom React hooks
│   │   └── index.js            # Additional hooks
│   │
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   │
│   ├── styles/
│   │   └── index.css           # Global styles
│   │
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind styles
│
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite configuration
└── .gitignore                 # Git ignore rules
```

## 🎨 Design System

### Colors

```javascript
// Primary Colors
- Cyan: #0ea5e9 (actions, highlights)
- Purple: #d946ef (secondary, accents)
- Blue: #3b82f6 (information)
- Violet: #8b5cf6 (tertiary)
- Pink: #ec4899 (alerts)
- Amber: #f59e0b (warnings)

// Status Colors
- Success: #10b981 (green)
- Warning: #f59e0b (amber)
- Error: #ef4444 (red)
- Info: #3b82f6 (blue)

// Dark Theme
- Background: #0f172a (primary)
- Surface: rgba(255, 255, 255, 0.1) (glass)
- Text: #e5e7eb (primary text)
- Muted: #9ca3af (secondary text)
```

### Typography

```javascript
// Font Families
- Display: 'Inter' (main UI)
- Monospace: 'JetBrains Mono' (code/data)

// Font Sizes
- 4xl: 36px (headings)
- lg: 18px (subheadings)
- base: 16px (body)
- sm: 14px (captions)
- xs: 12px (small text)
```

### Components

#### StatCard
```jsx
<StatCard
  icon={Activity}
  label="Active Requests"
  value="1,243"
  unit="req/s"
  trend={12}
  color="cyan"
/>
```

#### Badge
```jsx
<Badge variant="success">Success</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
```

#### Button
```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
```

## 📄 Pages Overview

### 1. **Login Page** (`/login`)
- JWT-based authentication
- Email/password fields
- Demo credentials provided
- Beautiful glassmorphism UI
- Animated backgrounds

### 2. **Dashboard** (`/dashboard`)
Main monitoring hub featuring:
- Real-time metrics (requests, throughput, response time)
- 24-hour charts (traffic, response time, errors)
- Cache hit/miss ratio
- System resource usage (CPU, memory)
- Service health status
- 6+ statistical cards

### 3. **Logs** (`/logs`)
Real-time request logging with:
- Live request stream
- Method and status code badges
- IP address tracking
- Search/filter functionality
- Export capabilities
- Auto-scrolling updates

### 4. **API Testing** (`/api-testing`)
Postman-like testing console:
- GET/POST/PUT/DELETE/PATCH support
- Custom headers
- Request body editor
- JSON response viewer
- Request history
- Response timing
- Copy to clipboard

### 5. **Redis Monitoring** (`/redis`)
Cache performance analytics:
- Cache hit/miss ratio visualization
- Memory usage tracking
- Connected clients counter
- Commands per second
- Top cached keys table
- TTL (time-to-live) display
- Key deletion functionality

### 6. **Traffic Monitor** (`/traffic`)
Live API traffic visualization:
- 24-hour traffic graph
- Error rate trends
- Live request stream
- Service performance metrics
- Connection status

### 7. **Rate Limiter** (`/rate-limiter`)
DDoS protection monitoring:
- Requests per minute tracking
- Blocked IP visualization
- IP whitelist/blacklist management
- Request limit progress bars
- Threat analytics
- Duration tracking

### 8. **WebSocket Monitor** (`/websocket`)
Real-time communication tracking:
- Active connection count
- Total connected users
- Messages per second
- Average latency
- Connection table
- Communication channels
- Room/topic subscriptions

### 9. **Kubernetes** (`/kubernetes`)
Cluster monitoring dashboard:
- Pod status and health
- Node information
- CPU/memory usage charts
- Container restart counts
- Cluster resource allocation
- StatefulSet monitoring

### 10. **Kafka Events** (`/kafka`)
Event streaming analytics:
- Topic list and stats
- Producer/consumer count
- Consumer lag visualization
- Message throughput
- Topic health
- Partition distribution

### 11. **Service Discovery** (`/services`)
Microservices registry:
- Service health status
- Response time metrics
- Uptime percentage
- Request count
- CPU/memory usage per service
- Service dependencies
- Dependency latency

### 12. **Analytics** (`/analytics`)
Comprehensive insights:
- Time range selector (1h, 24h, 7d, 30d)
- API traffic analysis
- Performance metrics
- Error analysis
- Custom reports

### 13. **Settings** (`/settings`)
Configuration panel:
- Theme selection
- Notification preferences
- Auto-refresh settings
- Email alert configuration
- System information display

## 🔌 API Integration

### Environment Configuration

Edit proxy settings in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
  '/socket.io': {
    target: 'http://localhost:3000',
    ws: true,
  }
}
```

### API Endpoints Used

```javascript
// Authentication
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh-token
POST   /api/auth/logout
GET    /api/auth/me

// Users
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

// Orders
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id
POST   /api/orders/:id/cancel

// Payments
POST   /api/payments/process
GET    /api/payments/:id
POST   /api/payments/refund

// Metrics & Monitoring
GET    /api/metrics
GET    /api/health
GET    /api/cache/stats
POST   /api/cache/clear
```

## 🔐 Authentication Flow

```javascript
1. User enters credentials
2. API returns JWT token + user data
3. Token stored in localStorage
4. Token included in all requests via Axios interceptor
5. Automatic redirect on 401 Unauthorized
6. Token refresh before expiry
```

### Using Auth Context

```jsx
import { useAuth } from './context/AuthContext'

function Component() {
  const { user, token, login, logout, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <div>{user.name}</div>
}
```

## 📡 WebSocket Integration

### Real-time Updates

```javascript
// Socket.IO events received:
'metrics:update'        // New metrics data
'log:new'               // New log entry
'traffic:update'        // Traffic update
'service:status'        // Service status change
'ratelimit:alert'       // Rate limit alert
'redis:alert'           // Redis alert
'kafka:event'           // Kafka event
```

### Using Socket Events

```jsx
import { useEffect } from 'react'
import { onMetricsUpdate, emitEvent } from './services/socket'

function Component() {
  useEffect(() => {
    onMetricsUpdate((data) => {
      console.log('Metrics updated:', data)
    })
  }, [])
  
  return <div>Live updating...</div>
}
```

## 🎬 Animations & Transitions

### Framer Motion Examples

```jsx
// Fade in animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Staggered children
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📊 Charts & Graphs

### Available Chart Types

```jsx
<TrafficLineChart data={data} />       // Line chart
<ResponseTimeChart data={data} />      // Area chart
<ErrorRateChart data={data} />         // Bar chart
<CacheRatioChart data={data} />        // Pie chart
<CPUMemoryChart data={data} />         // Composed chart
<ServiceHealthChart data={data} />     // Pie chart
```

### Data Format

```javascript
// Line/Area charts
[
  { time: '00:00', value: 1200 },
  { time: '01:00', value: 1800 },
]

// Pie charts
[
  { name: 'Success', value: 87 },
  { name: 'Error', value: 13 },
]
```

## 🪝 Custom Hooks

```javascript
// Local storage persistence
const [value, setValue] = useLocalStorage('key', initialValue)

// Debounced value
const debouncedValue = useDebounce(value, 500)

// Window resize detection
const { width, height } = useWindowSize()

// Click outside detection
const ref = useClickOutside(() => console.log('clicked outside'))

// Toggle state
const [isOpen, toggle] = useToggle(false)

// Async operations
const { execute, status, value, error } = useAsync(asyncFn)
```

## 🛠️ Utility Functions

```javascript
// Formatting
formatBytes(1048576)           // "1 MB"
formatTime(timestamp)          // "14:30:45"
formatNumber(1000)             // "1,000"
formatPercentage(50, 100)      // "50.00"
truncateString(str, 20)        // "Long text..."

// Status colors
getStatusColor(status)         // CSS class
getStatusBg(status)            // Background classes
getMethodColor(method)         // Method-based color
getStatusCodeColor(code)       // HTTP status color

// Chart utilities
generateChartColors()          // Color palette array
```

## 📱 Responsive Design

### Breakpoints

```javascript
sm: 640px   // Small screens
md: 768px   // Medium screens
lg: 1024px  // Large screens
xl: 1280px  // Extra large
```

### Mobile Optimization

- Collapsible sidebar on mobile
- Stacked layout on small screens
- Touch-friendly buttons
- Optimized chart display
- Responsive tables

## 🔍 Performance Optimization

### Code Splitting

```javascript
// Routes are automatically code-split by Vite
const Page = lazy(() => import('./pages/Page'))
```

### Image Optimization

- Use SVG icons (Lucide React)
- Optimize static assets
- Lazy load images

### Caching

```javascript
// HTTP cache via Axios
apiClient.defaults.headers.common['Cache-Control'] = 'max-age=300'
```

## 🐛 Debugging

### Browser DevTools

1. **React DevTools**: Install React DevTools extension
2. **Redux DevTools**: Monitor state changes
3. **Network Tab**: Monitor API calls
4. **Console**: View logs and errors

### Enable Logging

```javascript
// In development
console.log('Debug:', value)

// Production build
// Set NODE_ENV=production npm run build
```

## 📦 Deployment

### Build for Production

```bash
npm run build
# Output: dist/ folder
```

### Environment Variables

```javascript
// .env.production
VITE_API_BASE_URL=https://api.gatex.com
VITE_WS_URL=wss://api.gatex.com
```

### Deploy Strategies

1. **Static Hosting** (Vercel, Netlify)
2. **Docker Container**
3. **Kubernetes**
4. **AWS S3 + CloudFront**
5. **CDN Distribution**

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

1. Follow the existing code style
2. Use Tailwind utilities
3. Add proper TypeScript types
4. Test responsive layouts
5. Optimize performance
6. Update documentation

## 📄 License

GateX Dashboard - Enterprise API Gateway Monitoring Platform
© 2024. All rights reserved.

---

**Need Help?** Refer to the main README.md in the backend directory or check the inline code comments.

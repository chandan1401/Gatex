# GateX Dashboard - Quick Reference

## 🚀 Getting Started (2 minutes)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
# http://localhost:5173

# 5. Login
# Email: admin@gatex.com
# Password: password
```

## 📱 Available Pages

| URL | Page | Purpose |
|-----|------|---------|
| `/login` | Login | Authentication |
| `/dashboard` | Dashboard | Main monitoring hub |
| `/logs` | Logs | Real-time request logging |
| `/api-testing` | API Testing | Postman-like console |
| `/redis` | Redis | Cache analytics |
| `/traffic` | Traffic Monitor | Live traffic visualization |
| `/rate-limiter` | Rate Limiter | DDoS protection monitoring |
| `/kubernetes` | Kubernetes | K8s cluster monitoring |
| `/kafka` | Kafka | Event streaming analytics |
| `/websocket` | WebSocket | Real-time connection monitoring |
| `/services` | Services | Microservice registry |
| `/analytics` | Analytics | Comprehensive analytics |
| `/settings` | Settings | User preferences |

## 🎨 Key Components

```jsx
// Import components
import { Card, StatCard, Badge, Button } from './components/CommonComponents'
import { Layout } from './components/Layout'
import { useAuth } from './context/AuthContext'
import { useNotification } from './context/NotificationContext'
import { useFetch } from './hooks/useCustomHooks'

// Use in page
export default function Page() {
  return (
    <Layout>
      <StatCard icon={Icon} label="Label" value="123" />
      <Card>Content</Card>
      <Badge variant="success">Success</Badge>
      <Button>Click</Button>
    </Layout>
  )
}
```

## 🔌 API Usage

```javascript
// Import services
import { authAPI, userAPI, metricsAPI } from './services/api'
import { onMetricsUpdate } from './services/socket'

// Make API call
async function loadData() {
  const response = await metricsAPI.getMetrics()
  return response.data
}

// Listen to WebSocket events
useEffect(() => {
  onMetricsUpdate((data) => {
    console.log('Updated:', data)
  })
}, [])
```

## 🎬 Animations

```jsx
import { motion } from 'framer-motion'

// Simple fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>

// With hover
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Clickable
</motion.div>

// Staggered children
<motion.div variants={containerVariants}>
  {items.map(item => (
    <motion.div key={item} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📊 Charts

```jsx
import {
  TrafficLineChart,
  ResponseTimeChart,
  ErrorRateChart,
  CacheRatioChart,
  CPUMemoryChart,
  ServiceHealthChart,
} from './components/Charts'

// Use chart
<TrafficLineChart data={chartData} />
```

## 🎯 Common Tasks

### Create New Page

```jsx
// 1. Create file: src/pages/MyPage.jsx
import MainLayout from '../components/Layout'

export default function MyPage({ user }) {
  return (
    <MainLayout user={user}>
      <h1>My Page</h1>
    </MainLayout>
  )
}

// 2. Add route in App.jsx
<Route path="/my-page" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

// 3. Add sidebar link in Sidebar.jsx
{ icon: MyIcon, label: 'My Page', href: '/my-page' }
```

### Add API Endpoint

```javascript
// In src/services/api.js
export const myAPI = {
  getAll: () => apiClient.get('/my-endpoint'),
  getOne: (id) => apiClient.get(`/my-endpoint/${id}`),
  create: (data) => apiClient.post('/my-endpoint', data),
  update: (id, data) => apiClient.put(`/my-endpoint/${id}`, data),
  delete: (id) => apiClient.delete(`/my-endpoint/${id}`),
}
```

### Display Notification

```jsx
import { useNotification } from './context/NotificationContext'

function MyComponent() {
  const { success, error, warning, info } = useNotification()

  return (
    <button onClick={() => success('Operation completed!')}>
      Click Me
    </button>
  )
}
```

### Use Custom Hook

```jsx
import { useLocalStorage, useFetch, useDebounce } from './hooks/useCustomHooks'

function Component() {
  // Store value in localStorage
  const [value, setValue] = useLocalStorage('key', 'default')

  // Debounce input
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  // Fetch data
  const { data, loading, error } = useFetch('/api/endpoint')

  return <div>{data}</div>
}
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code quality
npm run lint            # Run linter

# Package management
npm install             # Install dependencies
npm update              # Update packages
npm outdated            # Check outdated packages

# Cleanup
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall
```

## 🌐 Environment Variables

```javascript
// .env (Development)
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000

// .env.production (Production)
VITE_API_BASE_URL=https://api.gatex.com
VITE_WS_URL=wss://api.gatex.com
```

## 🐛 Debugging Tips

```javascript
// Check authentication
const { user, isAuthenticated } = useAuth()
console.log('Auth:', { user, isAuthenticated })

// Inspect API calls
// Open DevTools → Network tab
// Look for /api/* requests

// Check Socket events
// Open DevTools → Console
// Type: socket.on('*', msg => console.log(msg))

// React DevTools
// Install extension from Chrome Store
// Click React tab in DevTools
```

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px   // Small phones
md: 768px   // Tablets
lg: 1024px  // Desktops
xl: 1280px  // Large screens

// Use in classes
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

## 🎨 Colors

```javascript
// Tailwind colors
Cyan:    #0ea5e9    (Primary actions)
Purple:  #d946ef    (Secondary accents)
Success: #10b981    (Success messages)
Warning: #f59e0b    (Warnings)
Error:   #ef4444    (Errors)
Info:    #3b82f6    (Information)

// Use in classes
<div className="text-cyan-500 bg-purple-900 border-green-500">
  Colored content
</div>
```

## 📚 File Structure

```
src/
├── components/
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   ├── Layout.jsx
│   ├── CommonComponents.jsx
│   ├── Charts.jsx
│   ├── NotificationCenter.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── LogsPage.jsx
│   ├── APITestingPage.jsx
│   ├── RedisPage.jsx
│   ├── TrafficPage.jsx
│   ├── RateLimiterPage.jsx
│   ├── KubernetesPage.jsx
│   ├── KafkaPage.jsx
│   ├── WebSocketPage.jsx
│   ├── ServicesPage.jsx
│   ├── AnalyticsPage.jsx
│   └── SettingsPage.jsx
├── context/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── services/
│   ├── api.js
│   └── socket.js
├── hooks/
│   ├── useCustomHooks.js
│   └── index.js
├── utils/
│   └── helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Deploy Commands

```bash
# Vercel
npm i -g vercel
vercel login
vercel

# Netlify
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist

# AWS
npm run build
aws s3 sync dist/ s3://your-bucket
aws cloudfront create-invalidation --distribution-id ID --paths "/*"

# Docker
docker build -t gatex-dashboard .
docker run -p 3000:3000 gatex-dashboard
```

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)
- [Socket.IO](https://socket.io)
- [Vite](https://vitejs.dev)

## ❓ Common Questions

**Q: How do I change the API URL?**
A: Edit `.env` file and update `VITE_API_BASE_URL`

**Q: How do I add a new page?**
A: Create file in `src/pages/`, add route in `App.jsx`, add sidebar link

**Q: How do I use WebSocket?**
A: Import from `./services/socket` and use event listeners

**Q: How do I show notifications?**
A: Use `useNotification()` hook and call `success()`, `error()`, etc.

**Q: How do I make API calls?**
A: Import from `./services/api` and use the API methods

---

**Need help?** See [README.md](./README.md), [SETUP.md](./SETUP.md), or [API-INTEGRATION.md](./API-INTEGRATION.md)

**Quick Deploy?** Run: `npm install && npm run build && npm run preview`

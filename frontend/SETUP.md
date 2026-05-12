# GateX Dashboard - Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Server will run on: `http://localhost:5173`

### 3. Login
- **Email**: `admin@gatex.com`
- **Password**: `password`

## Environment Setup

### Backend Connection

Ensure backend API is running on `http://localhost:3000`

Update `vite.config.js` if using different port:
```javascript
proxy: {
  '/api': {
    target: 'http://your-backend-url:port',
  }
}
```

### WebSocket Configuration

The frontend automatically connects to the same host as the API server.

## Available Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── context/          # React context (auth, notifications)
├── services/         # API and WebSocket services
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
└── styles/           # Global CSS
```

## Key Features

### 1. Authentication
- JWT-based login
- Token stored in localStorage
- Protected routes
- Automatic logout on 401

### 2. Real-time Updates
- WebSocket integration
- Live metrics updates
- Real-time notifications
- Socket.IO client

### 3. API Testing
- Postman-like interface
- Support for all HTTP methods
- Custom headers and body
- JSON response formatting

### 4. Monitoring Dashboards
- Traffic analytics
- Performance metrics
- Error tracking
- Resource monitoring

### 5. Service Management
- Microservice registry
- Health status tracking
- Dependency visualization
- Load balancing insights

## Configuration

### Tailwind CSS

Customization in `tailwind.config.js`:
- Colors: Primary colors (cyan, purple)
- Breakpoints: Responsive design
- Animations: Custom animations

### Vite Configuration

Proxy setup in `vite.config.js`:
- API proxy to backend
- WebSocket support
- Hot module replacement

## Performance Tips

1. **Use React DevTools**
   - Monitor re-renders
   - Check component hierarchy

2. **Code Splitting**
   - Routes auto-split by Vite
   - Use lazy() for components

3. **Caching**
   - API responses cached
   - Static assets cached

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Linux/Mac:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### WebSocket Connection Failed
- Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify Socket.IO is enabled

### API Requests Failing
- Check backend is running
- Verify proxy configuration in vite.config.js
- Check browser network tab for details

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Development Workflow

### 1. Component Development
```jsx
// Create new component in src/components/
import { motion } from 'framer-motion'
import { Card, Button } from './CommonComponents'

export default function MyComponent() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <Button>Click Me</Button>
      </Card>
    </motion.div>
  )
}
```

### 2. Page Creation
```jsx
// Create new page in src/pages/
import MainLayout from '../components/Layout'

export default function MyPage({ user }) {
  return (
    <MainLayout user={user}>
      <h1>My Page</h1>
    </MainLayout>
  )
}
```

### 3. API Integration
```jsx
import { userAPI } from '../services/api'
import { useEffect, useState } from 'react'

function MyComponent() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userAPI.getAll().then(res => setUsers(res.data))
  }, [])

  return <div>{users.length} users</div>
}
```

### 4. Real-time Updates
```jsx
import { useEffect } from 'react'
import { onMetricsUpdate } from '../services/socket'

function DashboardComponent() {
  useEffect(() => {
    onMetricsUpdate((data) => {
      console.log('Updated metrics:', data)
    })
  }, [])

  return <div>Real-time dashboard</div>
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Production Deployment

### 1. Build
```bash
npm run build
```

### 2. Deploy Built Files
Upload `dist/` folder to your hosting:
- Vercel
- Netlify
- AWS S3
- Azure Static Web Apps

### 3. Environment Variables
Set in your hosting platform:
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

### 4. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t gatex-dashboard .
docker run -p 3000:3000 gatex-dashboard
```

## Monitoring & Analytics

### Built-in Features
- Request logging
- Error tracking
- Performance metrics
- Real-time alerts
- Service health monitoring

### Third-party Integration
- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (APM)

## Performance Benchmarks

Target metrics:
- Lighthouse Score: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <2.5s
- Cumulative Layout Shift: <0.1

## Security Considerations

1. **JWT Token**
   - Stored in localStorage
   - Included in Authorization header
   - Refreshed automatically

2. **HTTPS**
   - Required for production
   - WebSocket via WSS

3. **CORS**
   - Configured on backend
   - Frontend sends credentials

4. **Content Security Policy**
   - Restrict resource loading
   - Prevent XSS attacks

## Common Issues & Solutions

### Issue: Blank Page After Login
**Solution**: Clear localStorage and cookies, refresh page

### Issue: Charts Not Displaying
**Solution**: Check data format matches Recharts requirements

### Issue: WebSocket Not Connecting
**Solution**: Verify backend WebSocket server is running

### Issue: API Requests Timing Out
**Solution**: Increase timeout in Axios or reduce payload size

## Next Steps

1. **Customize Branding**
   - Update logo and colors
   - Modify sidebar navigation
   - Adjust theme

2. **Add Custom Pages**
   - Create new page component
   - Add route in App.jsx
   - Add sidebar link

3. **Integrate Backend**
   - Test API endpoints
   - Implement WebSocket events
   - Configure authentication

4. **Deploy**
   - Build for production
   - Set environment variables
   - Upload to hosting

## Support & Resources

- **Documentation**: See [README.md](./README.md)
- **Backend**: See `../README.md`
- **Issues**: Check GitHub issues
- **Community**: Join community forum

## License

GateX Dashboard © 2024. All rights reserved.

---

**Happy coding! 🚀**

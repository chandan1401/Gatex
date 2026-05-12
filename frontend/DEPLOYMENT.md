# GateX Dashboard - Deployment Guide

## Pre-deployment Checklist

- [ ] All npm dependencies installed (`npm install`)
- [ ] Code linting passed
- [ ] All pages tested locally
- [ ] API endpoints verified working
- [ ] WebSocket connection tested
- [ ] Environment variables configured
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in dev tools

## Build for Production

### Development Build

```bash
# Start dev server with hot reload
npm run dev

# Server runs on http://localhost:5173
```

### Production Build

```bash
# Build optimized files
npm run build

# Output: dist/ folder with minified files

# Preview production build locally
npm run preview

# Server runs on http://localhost:5173
```

### Build Output

```
dist/
├── index.html           # Entry HTML
├── assets/
│   ├── index-xxx.js     # Minified JS
│   ├── index-xxx.css    # Minified CSS
│   └── vendor-xxx.js    # Vendor bundle
└── favicon.ico          # Favicon
```

## Environment Configuration

### Development (.env)

```javascript
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
VITE_DEBUG_MODE=true
```

### Production (.env.production)

```javascript
VITE_API_BASE_URL=https://api.gatex.com
VITE_WS_URL=wss://api.gatex.com
VITE_DEBUG_MODE=false
```

### Staging (.env.staging)

```javascript
VITE_API_BASE_URL=https://staging-api.gatex.com
VITE_WS_URL=wss://staging-api.gatex.com
VITE_DEBUG_MODE=true
```

## Deployment Platforms

### 1. Vercel (Recommended)

#### Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Configuration (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url",
    "VITE_WS_URL": "@vite_ws_url"
  }
}
```

#### Environment Variables

Set in Vercel dashboard:
- Project Settings → Environment Variables
- Add `VITE_API_BASE_URL` and `VITE_WS_URL`

### 2. Netlify

#### Deploy via Git

1. Push code to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

#### Manual Deploy

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### 3. AWS S3 + CloudFront

#### Setup

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### CloudFront Configuration

```yaml
Origin:
  Domain Name: your-bucket-name.s3.amazonaws.com
Cache Behavior:
  Viewer Protocol Policy: Redirect HTTP to HTTPS
  Cache Policy: CachingOptimized
Error Pages:
  404 -> /index.html (300s cache)
  403 -> /index.html (300s cache)
```

### 4. Docker

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Build and Run

```bash
# Build image
docker build -t gatex-dashboard:latest .

# Run container
docker run -p 3000:3000 -e VITE_API_BASE_URL=https://api.gatex.com gatex-dashboard:latest

# Push to registry
docker tag gatex-dashboard:latest myregistry/gatex-dashboard:latest
docker push myregistry/gatex-dashboard:latest
```

#### Docker Compose

```yaml
version: '3.8'
services:
  dashboard:
    image: gatex-dashboard:latest
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://api:3000
      - VITE_WS_URL=ws://api:3000
    depends_on:
      - api
  api:
    image: gatex-api:latest
    ports:
      - "3000:3000"
```

### 5. Kubernetes

#### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gatex-dashboard
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gatex-dashboard
  template:
    metadata:
      labels:
        app: gatex-dashboard
    spec:
      containers:
      - name: dashboard
        image: myregistry/gatex-dashboard:latest
        ports:
        - containerPort: 3000
        env:
        - name: VITE_API_BASE_URL
          value: "https://api.gatex.com"
        - name: VITE_WS_URL
          value: "wss://api.gatex.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: gatex-dashboard-svc
spec:
  selector:
    app: gatex-dashboard
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: gatex-dashboard-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: gatex-dashboard
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace gatex

# Deploy
kubectl apply -f deployment.yaml -n gatex

# Check status
kubectl get pods -n gatex
kubectl get svc -n gatex

# View logs
kubectl logs -f deployment/gatex-dashboard -n gatex

# Update deployment
kubectl set image deployment/gatex-dashboard \
  dashboard=myregistry/gatex-dashboard:v1.1 -n gatex
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy GateX Dashboard

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/download-artifact@v3
      with:
        name: dist
    
    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Post-deployment Checks

### Verify Deployment

```bash
# Check site loads
curl https://your-domain.com

# Check API connectivity
curl -H "Authorization: Bearer <token>" \
  https://your-domain.com/api/health

# Check WebSocket
wscat -c wss://your-domain.com/socket.io
```

### Performance Monitoring

```bash
# Lighthouse audit
lighthouse https://your-domain.com --output-path=report.html

# Page Speed Insights
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://your-domain.com"
```

### Error Monitoring Setup

Add error tracking service:

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react"

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  })
}
```

## Rollback Procedure

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback

# Or promote specific deployment
vercel promote <deployment-url>
```

### AWS S3 Rollback

```bash
# Keep previous dist as backup
aws s3 sync dist/ s3://your-bucket-name/v1.0
aws s3 sync s3://your-bucket-name/v1.0 s3://your-bucket-name

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/gatex-dashboard -n gatex

# Rollback to previous
kubectl rollout undo deployment/gatex-dashboard -n gatex

# Rollback to specific revision
kubectl rollout undo deployment/gatex-dashboard --to-revision=2 -n gatex
```

## Health Checks

### Uptime Monitoring

```javascript
// Set up monitoring endpoint
// GET /health
// Response: { status: 'healthy', version: '1.0.0', uptime: 12345 }
```

### Synthetic Monitoring

```bash
# Use service like Healthchecks.io
# Or implement custom monitoring:

const health = async () => {
  try {
    const response = await fetch('https://your-domain.com')
    if (response.ok) {
      console.log('✅ Site healthy')
    }
  } catch (error) {
    console.error('❌ Site down:', error)
    // Send alert
  }
}

setInterval(health, 300000) // Every 5 minutes
```

## Performance Optimization

### Compression

```nginx
# nginx configuration
gzip on;
gzip_types text/plain text/css text/javascript application/javascript;
gzip_min_length 1000;
```

### Caching Headers

```nginx
# Static assets (long cache)
location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# HTML (short cache)
location ~* \.html?$ {
  expires 10m;
  add_header Cache-Control "public, must-revalidate";
}
```

### Content Delivery

- Use CDN for static assets
- Enable compression (gzip, brotli)
- Implement image optimization
- Use Service Worker for caching

## Security Hardening

### HTTPS/SSL

```bash
# Generate SSL certificate (Let's Encrypt)
certbot certonly --standalone -d your-domain.com

# Renew automatically
certbot renew
```

### Security Headers

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";
```

### CORS Configuration

```javascript
// Backend CORS settings
cors({
  origin: ['https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})
```

## Troubleshooting Deployment

### Blank Page
- Check dist/ folder exists
- Verify index.html in dist/
- Check browser console for errors
- Verify base URL in vite.config.js

### CSS Not Loading
- Verify assets/ folder exists
- Check CSS file hashes match HTML
- Clear browser cache
- Check web server configuration

### API Calls Failing
- Verify backend is running
- Check API base URL in environment
- Verify CORS headers
- Check authentication token

### WebSocket Not Connecting
- Verify WebSocket URL is correct
- Check firewall allows WebSocket
- Verify backend WebSocket server
- Check authentication headers

## Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update to latest versions
npm install --latest
```

### Backup Strategy

- Daily backup of dist/ folder
- Version control all code
- Keep deployment logs
- Archive old releases

---

For more help, see [SETUP.md](./SETUP.md) or [README.md](./README.md)

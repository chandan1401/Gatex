# GateX Deployment Guide

Complete deployment guide for GateX API Gateway across different environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Compose](#docker-compose-deployment)
3. [Kubernetes](#kubernetes-deployment)
4. [Production Setup](#production-setup)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Troubleshooting](#troubleshooting)

## Local Development

### Requirements
- Node.js 18+
- npm or yarn
- Redis (optional, can use Docker)
- MongoDB (optional, can use MongoDB Atlas)

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/yourusername/api-gateway.git
cd api-gateway

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Start Redis (Docker)
docker run -d -p 6379:6379 redis:7-alpine

# 5. Start MongoDB (Docker)
docker run -d -p 27017:27017 mongo:6

# 6. Start development server
npm run dev
```

### Verification
```bash
curl http://localhost:3000/health
# Expected: { "status": "UP", ... }
```

## Docker Compose Deployment

### Single Command Setup

```bash
# Start entire stack
docker-compose up -d

# View logs
docker-compose logs -f

# Verify services
docker-compose ps
```

### Service URLs
- API Gateway: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin:admin)
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002
- Order Service: http://localhost:3003
- Payment Service: http://localhost:3004

### Database Access

```bash
# MongoDB
mongosh mongodb://localhost:27017/gatex

# Redis
redis-cli -h localhost -p 6379
```

### Common Commands

```bash
# Stop all services
docker-compose down

# Remove volumes (cleanup)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View specific service logs
docker-compose logs api-gateway

# Access container shell
docker exec -it gatex-api-gateway sh
```

## Kubernetes Deployment

### Prerequisites
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Install minikube (for local testing)
brew install minikube  # macOS
choco install minikube  # Windows
```

### Initial Setup

```bash
# 1. Start minikube cluster
minikube start

# 2. Build images in minikube
minikube docker-env
eval $(minikube docker-env)
docker build -t gatex-api-gateway:latest .

# 3. Apply manifests
kubectl apply -f kubernetes/

# 4. Verify deployments
kubectl get deployments -n gatex
kubectl get pods -n gatex
kubectl get svc -n gatex
```

### Access Services

```bash
# Port forward API Gateway
kubectl port-forward -n gatex svc/api-gateway 3000:80

# Port forward Prometheus
kubectl port-forward -n gatex svc/prometheus 9090:9090

# Port forward Grafana
kubectl port-forward -n gatex svc/grafana 3000:3000
```

### Scale Deployments

```bash
# Scale to 5 replicas
kubectl scale deployment api-gateway -n gatex --replicas=5

# Check HPA status
kubectl get hpa -n gatex
```

### Monitor Deployment

```bash
# Watch pod status
kubectl get pods -n gatex -w

# View logs
kubectl logs -n gatex deployment/api-gateway -f

# Get detailed pod info
kubectl describe pod <pod-name> -n gatex

# Check resource usage
kubectl top nodes
kubectl top pods -n gatex
```

### Update Deployment

```bash
# Rolling update (new image)
kubectl set image deployment/api-gateway \
  api-gateway=gatex-api-gateway:2.0.0 -n gatex

# Check rollout status
kubectl rollout status deployment/api-gateway -n gatex

# Rollback if needed
kubectl rollout undo deployment/api-gateway -n gatex
```

## Production Setup

### AWS ECS Deployment

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name gatex-api-gateway --region us-east-1
```

2. **Build and Push Image**
```bash
# Build
docker build -t gatex-api-gateway:1.0.0 .

# Tag
docker tag gatex-api-gateway:1.0.0 \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/gatex-api-gateway:1.0.0

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/gatex-api-gateway:1.0.0
```

3. **Create ECS Task Definition**
See `docs/ecs-task-definition.json`

4. **Create ECS Service**
```bash
aws ecs create-service --cluster gatex-cluster --service-name api-gateway ...
```

### AWS EKS Deployment

```bash
# Create cluster
eksctl create cluster --name gatex --region us-east-1

# Deploy application
kubectl apply -f kubernetes/

# Setup Load Balancer
kubectl apply -f kubernetes/ingress.yml
```

### Google Cloud Run

```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT-ID/gatex-api-gateway

# Deploy
gcloud run deploy api-gateway \
  --image gcr.io/PROJECT-ID/gatex-api-gateway \
  --memory 512M \
  --region us-central1
```

### SSL/TLS Configuration

1. **Generate Certificates (self-signed)**
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

2. **Create Kubernetes Secret**
```bash
kubectl create secret tls gateway-tls \
  --cert=cert.pem \
  --key=key.pem -n gatex
```

3. **Configure NGINX** (see `nginx/nginx.conf`)

### Database Setup

#### MongoDB Production
```bash
# Atlas setup (recommended)
# Go to https://www.mongodb.com/cloud/atlas
# Create cluster and get connection string
# Add to .env

# Or self-hosted with replication
# Configure replica set for high availability
```

#### Redis Cluster
```bash
# Production Redis with sentinel
docker run -d \
  --name redis-sentinel \
  redis:7-alpine \
  redis-sentinel /etc/redis/sentinel.conf --port 26379
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t gatex-api-gateway:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push gatex-api-gateway:${{ github.sha }}
      
      - name: Deploy to K8s
        run: |
          kubectl set image deployment/api-gateway api-gateway=gatex-api-gateway:${{ github.sha }} -n gatex
```

### GitLab CI/CD

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm run test
    - npm run lint

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/api-gateway api-gateway=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA -n gatex
```

## Troubleshooting

### Services Won't Connect

```bash
# Check networking
docker network ls
docker network inspect gatex-network

# Check service names
docker exec gatex-api-gateway ping mongo
docker exec gatex-api-gateway ping redis
```

### Memory Issues

```bash
# Check memory usage
docker stats

# Increase Docker memory limit
# Docker Desktop → Preferences → Resources
```

### Port Conflicts

```bash
# Find what's using port 3000
lsof -i :3000

# Use different port
PORT=4000 npm start
```

### Database Connection Errors

```bash
# Test MongoDB
mongosh mongodb://mongo:27017 --eval "db.adminCommand('ping')"

# Test Redis
redis-cli -h redis ping

# Check logs
docker logs gatex-mongo
docker logs gatex-redis
```

### Kubernetes Issues

```bash
# Get node status
kubectl get nodes

# Check resource availability
kubectl describe nodes

# View events
kubectl get events -n gatex

# Check pod logs
kubectl logs <pod-name> -n gatex

# Debug pod
kubectl debug <pod-name> -n gatex -it --image=busybox
```

## Performance Tuning

### Database Optimization
- Create indexes on frequently queried fields
- Enable MongoDB compression
- Configure Redis persistence

### Application Tuning
- Adjust worker processes
- Enable clustering
- Configure connection pools

### Infrastructure Scaling
- Add more replicas
- Upgrade node specifications
- Use auto-scaling policies

## Monitoring & Alerts

### Set up Prometheus Alerts

```yaml
groups:
  - name: gatex
    rules:
      - alert: HighErrorRate
        expr: rate(gateway_total_errors[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighLatency
        expr: histogram_quantile(0.95, gateway_request_duration_seconds) > 1
        for: 5m
        annotations:
          summary: "High request latency"
```

### Grafana Dashboards

Import dashboard JSON from `monitoring/dashboards/`

## Backup & Recovery

### MongoDB Backup
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/gatex" --out=backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/gatex" backup/
```

### Redis Backup
```bash
# Backup
redis-cli BGSAVE
# File saved to dump.rdb

# Restore
# Copy dump.rdb to Redis data directory
```

## Health Checks

```bash
# API Gateway health
curl http://localhost:3000/health

# Service health
curl http://localhost:3000/api/v1/monitoring/health

# Metrics
curl http://localhost:3000/metrics
```

---

For more information, see [README.md](../README.md)

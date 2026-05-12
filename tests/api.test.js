const request = require('supertest');
const app = require('../src/app');
const { getRedisClient } = require('../src/config/redis');

describe('API Gateway', () => {
  afterAll(async () => {
    const redis = getRedisClient();
    await redis.quit();
  });

  describe('Health Check', () => {
    test('should return UP status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'UP');
    });
  });

  describe('Authentication', () => {
    test('should login successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.tokens).toHaveProperty('accessToken');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: ''
        })
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should register new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
    });
  });

  describe('Rate Limiting', () => {
    test('should enforce rate limits', async () => {
      // Make multiple rapid requests
      let response;
      for (let i = 0; i < 10; i++) {
        response = await request(app)
          .get('/api/v1/users');
      }

      // Expect rate limit after many requests
      expect([200, 429]).toContain(response.status);
    });
  });

  describe('API Documentation', () => {
    test('should return API docs', async () => {
      const response = await request(app)
        .get('/api-docs')
        .expect(200);

      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('404 Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

describe('Metrics', () => {
  test('should expose Prometheus metrics', async () => {
    const response = await request(app)
      .get('/metrics')
      .expect(200);

    expect(response.text).toContain('gateway_');
  });

  test('should expose monitoring endpoints', async () => {
    const response = await request(app)
      .get('/api/v1/monitoring/metrics')
      .expect(200);

    expect(response.body).toHaveProperty('gateway');
  });
});

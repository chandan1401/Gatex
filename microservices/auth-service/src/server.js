const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'auth-service' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  res.json({
    success: true,
    token: 'mock-jwt-token',
    user: { id: '1', email }
  });
});

// Register endpoint
app.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  res.status(201).json({
    success: true,
    user: { id: '1', email, name }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

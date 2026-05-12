const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'user-service' });
});

// Get users
app.get('/users', (req, res) => {
  res.json({
    success: true,
    users: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  res.json({
    success: true,
    user: { id: req.params.id, name: 'John Doe', email: 'john@example.com' }
  });
});

// Create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  res.status(201).json({
    success: true,
    user: { id: '3', name, email }
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

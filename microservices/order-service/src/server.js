const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'order-service' });
});

// Get orders
app.get('/orders', (req, res) => {
  res.json({
    success: true,
    orders: [
      { id: '1', userId: 'user-1', status: 'delivered', total: 199.99 },
      { id: '2', userId: 'user-1', status: 'shipped', total: 49.99 }
    ]
  });
});

// Create order
app.post('/orders', (req, res) => {
  const { items, shippingAddress } = req.body;
  
  res.status(201).json({
    success: true,
    order: { 
      id: '3', 
      items, 
      shippingAddress,
      status: 'pending',
      total: 299.99
    }
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});

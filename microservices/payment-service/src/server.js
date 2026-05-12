const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'payment-service' });
});

// Process payment
app.post('/process', (req, res) => {
  const { orderId, amount, method } = req.body;
  
  res.json({
    success: true,
    transaction: {
      id: 'txn-' + Date.now(),
      orderId,
      amount,
      method,
      status: 'success'
    }
  });
});

// Get transaction
app.get('/transactions/:id', (req, res) => {
  res.json({
    success: true,
    transaction: {
      id: req.params.id,
      orderId: 'order-1',
      amount: 199.99,
      status: 'success'
    }
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});

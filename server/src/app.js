require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AMEN+ backend is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AMEN+ backend running on port ${PORT}`);
  });
}

module.exports = app;

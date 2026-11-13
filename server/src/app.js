require('dotenv').config();
const express = require('express');
const cors = require('cors');
const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Strict CORS: Allow only exact origins explicitly listed in CLIENT_URL plus local development
// Wildcards (*) are strictly filtered out to prevent granting arbitrary origin access
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5299',
  'http://127.0.0.1:5299'
];
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
      .map((url) => url.trim())
      .filter((url) => url && url !== '*')
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header (e.g. server-to-server, curl, Render health checks)
      if (!origin) return callback(null, true);
      // Allow only exact matches in the whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Deny any unconfigured or arbitrary origins
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

// Health-check endpoint for Render / monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AMEN+ backend is running',
    timestamp: new Date().toISOString(),
  });
});

// YouTube API routes
app.use('/api/youtube', youtubeRoutes);

// Start server listening on all network interfaces (0.0.0.0) for Render container compatibility
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AMEN+ backend running on port ${PORT}`);
  });
}

module.exports = app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import customerAuthRoutes from './routes/customer-auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS using CORS_ORIGIN env var (comma-separated list)
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:8080,http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);

// Temporarily allow all origins to ensure CORS headers are present for deployed frontends.
// In production you can restrict this by setting `CORS_ORIGIN` and validating the origin.
// For now allow any origin so frontends can access the API. Remove or restrict
// this for stricter production CORS policies.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer-auth', customerAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

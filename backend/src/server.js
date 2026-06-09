import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';
import customerAuthRoutes from './routes/customer-auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

// Respect X-Forwarded-* headers when running behind a proxy (Render/Vercel).
app.set('trust proxy', 1);

// Middleware
// Configure CORS using CORS_ORIGIN env var (comma-separated list)
const defaultProductionOrigins = [
  'https://wildwavesafaris.com',
  'https://www.wildwavesafaris.com',
  'https://wildwave-safari.vercel.app',
  'https://wildwave-safaris-admin.vercel.app',
  'https://wildwave-admin.vercel.app',
  'https://wildwave-safaris.onrender.com',
  'https://wildwave-safaris-admin.onrender.com',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
];

const envOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const configuredOrigins = envOrigins.includes('*')
  ? ['*']
  : (envOrigins.length > 0
    ? [...new Set([...envOrigins, ...defaultProductionOrigins])]
    : (process.env.NODE_ENV === 'production' ? defaultProductionOrigins : ['*']));

const normalizeOrigin = (value) => {
  if (!value) {
    return '';
  }

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch {
    return value.trim().replace(/\/+$/, '').toLowerCase();
  }
};

const withWwwVariants = (origin) => {
  const normalized = normalizeOrigin(origin);

  try {
    const url = new URL(normalized);
    const variants = new Set([normalized]);

    if (url.hostname.startsWith('www.')) {
      variants.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ''}`);
    } else {
      variants.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ''}`);
    }

    return variants;
  } catch {
    return new Set([normalized]);
  }
};

const allowlist = new Set();
configuredOrigins
  .forEach((origin) => {
    if (origin === '*') {
      allowlist.add('*');
      return;
    }

    withWwwVariants(origin).forEach((variant) => allowlist.add(variant));
  });

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowlist.has('*') || allowlist.has(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '12mb' }));
app.use('/uploads', express.static(uploadsDir));

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
  if (err && err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS blocked for this origin' });
    return;
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

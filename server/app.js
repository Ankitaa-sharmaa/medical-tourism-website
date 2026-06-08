const path     = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Temporary diagnostic — shows if nested routing reaches Express and what creds are loaded
app.get('/api/auth/debug', (_req, res) => {
  res.json({
    routingOk:          true,
    adminEmailSource:   process.env.ADMIN_EMAIL    ? 'env_var' : 'hardcoded_default',
    adminEmail:         (process.env.ADMIN_EMAIL   || 'ankita.dev.work@gmail.com').trim().toLowerCase(),
    passwordSource:     process.env.ADMIN_PASSWORD ? 'env_var' : 'hardcoded_default',
    passwordLength:     (process.env.ADMIN_PASSWORD || '123456').trim().length,
    jwtSecretSet:       !!process.env.JWT_SECRET,
  });
});

app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/doctors',      require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services',     require('./routes/serviceRoutes'));

app.get('/api/health', (_req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    ok:            true,
    mongoConnected: state === 1,
    mongoState:    state,          // 0=disconnected 1=connected 2=connecting
    mongoUriSet:   !!process.env.MONGODB_URI,
    time:          new Date(),
  });
});

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
);

module.exports = app;

const path = require('path');
const fs   = require('fs');

const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);
// override:true ensures server/.env always wins over any corrupted Vercel env var
const dotenvResult = require('dotenv').config({ path: envPath, override: true });

// Startup diagnostics — visible in Vercel function logs
console.log('[DIAG] envFile:', envPath, '| exists:', envExists, '| dotenvError:', dotenvResult.error?.message ?? 'none');
const _u = process.env.MONGODB_URI || '';
console.log('[DIAG] MONGODB_URI len:', _u.length, '| start:', _u.slice(0, 20), '| end:', _u.slice(-10));

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
// Serve uploads from local dir (dev) and /tmp/uploads (Vercel serverless)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('/tmp/uploads'));

app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/doctors',      require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services',     require('./routes/serviceRoutes'));

app.get('/api/health', (_req, res) => {
  const state = mongoose.connection.readyState;
  const uri   = process.env.MONGODB_URI || '';
  res.json({
    ok:             true,
    mongoConnected: state === 1,
    mongoState:     state,
    mongoUriSet:    !!uri,
    mongoUriValid:  uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://'),
    mongoUriLen:    uri.length,
    mongoUriTail:   uri.slice(-6),  // last 6 chars — reveals trailing garbage without exposing creds
    time:           new Date(),
  });
});

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
);

module.exports = app;

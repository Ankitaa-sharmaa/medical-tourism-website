require('dotenv').config();

// NOTE: dns.setServers() was removed — it was a local-ISP workaround that
// breaks DNS inside Render/Railway containers. Atlas SRV resolves fine there.

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const mongoose  = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Accept localhost in dev + the configured CLIENT_URL + all *.vercel.app domains
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);                        // same-origin / curl / mobile
    if (origin.endsWith('.vercel.app')) return callback(null, true); // all Vercel preview URLs
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Body / static ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/doctors',      require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services',     require('./routes/serviceRoutes'));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, mongoState: mongoose.connection.readyState, time: new Date() })
);

// ── 404 / error handlers ──────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
);

// ── Startup ───────────────────────────────────────────────────────────────────
// Listen FIRST so Render's health check passes immediately,
// then connect to MongoDB in the background.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    // Log but don't exit — Render needs the HTTP process alive.
    // Mongoose will buffer operations until the DB reconnects.
    console.error('MongoDB connection error:', err.message);
  });

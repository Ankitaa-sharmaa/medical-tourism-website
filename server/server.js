require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const connectDB = require('./config/db');

const app = express();

// ── Database ────────────────────────────────────────────────────
connectDB();

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/doctors',      require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV, time: new Date() })
);

// ── 404 catch-all ───────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Global error handler ────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[MedTour] Unhandled error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`[MedTour] Server running on http://localhost:${PORT}`)
);

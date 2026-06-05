require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API routes ──────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/doctors',      require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services',     require('./routes/serviceRoutes'));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV, time: new Date() })
);

// ── 404 + error handlers ────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`[MedTour] Server running on http://localhost:${PORT}`)
);

// Catch-all Vercel serverless handler — routes all /api/* requests to Express.
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require   = createRequire(fileURLToPath(import.meta.url));
const mongoose  = require('mongoose');
const connectDB = require('../server/config/db');
const app       = require('../server/app');

// ─────────────────────────────────────────────────────────────────────────────
// Why time-based reconnect?
//
// Vercel freezes function instances between requests. While frozen, the Node.js
// event loop is paused so the MongoDB driver's background heartbeat cannot run.
// When Atlas (or a NAT gateway) silently closes the idle TCP socket during the
// freeze, mongoose.connection.readyState still reports 1 (connected) when the
// function thaws — leading to a 10 s "insertOne() buffering timed out" error.
//
// Solution: record when the last successful connect completed. If the cached
// connection is older than MAX_CONN_AGE_MS, proactively disconnect + reconnect
// BEFORE routing the request, regardless of what readyState reports.
// ─────────────────────────────────────────────────────────────────────────────
const MAX_CONN_AGE_MS = 55_000; // 55 s — safely under typical NAT idle timeout

let dbPromise    = null;
let lastDbError  = null;
let connectTime  = 0;
let reconnecting = false;

const getDB = () => {
  const now   = Date.now();
  const state = mongoose.connection.readyState; // 0=disconnected 1=connected 2=connecting 3=disconnecting
  const age   = now - connectTime;

  // If a reconnect is already in-flight, reuse the same promise (avoids double-connect)
  if (reconnecting && dbPromise) return dbPromise;

  // Fast path: driver reports connected AND the connection is recent enough to trust
  if (dbPromise && state === 1 && age < MAX_CONN_AGE_MS) return dbPromise;

  // Slow path: cold start, driver-detected disconnect (state 0/3), or stale connection
  reconnecting = true;
  connectTime  = now;

  dbPromise = (async () => {
    // Explicitly close any existing pool before reconnecting.
    // This forces Mongoose to create a fresh connection, avoiding reuse
    // of a socket that the driver's frozen heartbeat failed to invalidate.
    if (state === 1 || state === 2) {
      try { await mongoose.disconnect(); } catch { /* ignore close errors */ }
    }
    await connectDB();
  })()
    .then(() => { reconnecting = false; })
    .catch(err => {
      lastDbError  = err;
      dbPromise    = null;
      connectTime  = 0;
      reconnecting = false;
      throw err;
    });

  return dbPromise;
};

export default async function handler(req, res) {
  try {
    await getDB();
    lastDbError = null;
  } catch (err) {
    console.error('[Vercel] MongoDB connect error:', err.message);

    // Health endpoint always responds so we can diagnose connection problems
    if (req.url?.includes('/health')) {
      return res.json({
        ok:             true,
        mongoConnected: false,
        mongoState:     mongoose.connection.readyState,
        mongoUriSet:    !!process.env.MONGODB_URI,
        error:          err.message,
        fix:            'MongoDB Atlas → Network Access → add 0.0.0.0/0',
        time:           new Date(),
      });
    }

    return res.status(503).json({
      error:  'Database unavailable',
      detail: err.message,
    });
  }

  return app(req, res);
}

// Catch-all Vercel serverless — handles all /api/* routes.
// req.url is the full original path so Express routing works correctly.
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(fileURLToPath(import.meta.url));
const mongoose  = require('mongoose');
const connectDB = require('../server/config/db');
const app       = require('../server/app');

let dbPromise   = null;
let lastDbError = null;

const getDB = () => {
  // If Atlas dropped the idle connection, reset so we reconnect instead of
  // buffering for 10 s and then timing out with "insertOne() buffering timed out".
  if (dbPromise) {
    const state = mongoose.connection.readyState; // 0=disconnected 3=disconnecting
    if (state === 0 || state === 3) {
      dbPromise = null;
    }
  }
  if (!dbPromise) {
    lastDbError = null;
    dbPromise = connectDB().catch(err => {
      lastDbError = err;
      dbPromise   = null; // allow retry on next request
      throw err;
    });
  }
  return dbPromise;
};

export default async function handler(req, res) {
  try {
    await getDB();
    lastDbError = null;
  } catch (err) {
    console.error('[Vercel] MongoDB error:', err.message);

    // Health endpoint always responds — shows exactly what failed
    if (req.url?.includes('/health')) {
      const mongoose = require('mongoose');
      return res.json({
        ok:             true,
        mongoConnected: false,
        mongoState:     mongoose.connection.readyState,
        mongoUriSet:    !!process.env.MONGODB_URI,
        error:          err.message,
        fix:            'In MongoDB Atlas → Network Access → add IP 0.0.0.0/0 (Allow from anywhere)',
        time:           new Date(),
      });
    }

    return res.status(503).json({
      error:  'Database unavailable',
      detail: err.message,
      fix:    'Atlas Network Access → add 0.0.0.0/0 to the IP whitelist',
    });
  }

  return app(req, res);
}

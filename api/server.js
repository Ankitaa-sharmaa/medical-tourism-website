// Vercel serverless entry — ESM file, loads CJS Express app via createRequire.
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(fileURLToPath(import.meta.url));

const connectDB = require('../server/config/db');
const app       = require('../server/app');

// Start DB connection on cold start; re-use on warm invocations.
// Cleared on failure so the next request retries.
let dbPromise = null;
const getDB = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch(err => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

export default async function handler(req, res) {
  try {
    await getDB();
  } catch (err) {
    console.error('[Vercel] MongoDB connection failed:', err.message);
    // Health check still answers even when DB is down
    if (!req.url?.includes('/health')) {
      return res.status(503).json({
        error: 'Database unavailable.',
        fix:   'Add MONGODB_URI in Vercel → Project Settings → Environment Variables.',
        detail: err.message,
      });
    }
  }
  return app(req, res);
}

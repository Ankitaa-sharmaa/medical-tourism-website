// Catch-all Vercel serverless function for all /api/* routes.
// Vercel routes /api/:path* here natively — no rewrites needed.
// req.url is the full original path (e.g. /api/appointments), so Express routing works.
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(fileURLToPath(import.meta.url));

const connectDB = require('../server/config/db');
const app       = require('../server/app');

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

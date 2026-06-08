const connectDB = require('../server/config/db');
const app = require('../server/app');

// Connect on cold start; Mongoose buffers queries until the connection is ready.
connectDB().catch(err => console.error('[Vercel] MongoDB error:', err.message));

module.exports = app;

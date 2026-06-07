const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MedTour] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[MedTour] MongoDB connection error:', err.message);
    console.error('[MedTour] Server will continue — auth/JWT routes still work without DB.');
    // Do not exit: auth routes don't need MongoDB, server must stay alive.
  }
};

module.exports = connectDB;

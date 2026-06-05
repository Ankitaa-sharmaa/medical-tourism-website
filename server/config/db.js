const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MedTour] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[MedTour] MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. ' +
      'Add it in Vercel → Project Settings → Environment Variables → MONGODB_URI'
    );
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,  // fail in 5s — leaves time for Vercel to return error
    connectTimeoutMS:         5000,
  });
};

module.exports = connectDB;

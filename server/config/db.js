const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. ' +
      'Add it in Vercel → Project Settings → Environment Variables → MONGODB_URI'
    );
  }
  mongoose.set('bufferCommands', false); // throw immediately if disconnected, don't buffer
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS:         10000,
    socketTimeoutMS:          45000,
  });
};

module.exports = connectDB;

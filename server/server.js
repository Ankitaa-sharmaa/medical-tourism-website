const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Listen first so Render's health check passes immediately,
// then connect to MongoDB in the background.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    fullName:      { type: String, required: true, trim: true },
    email:         { type: String, required: true, trim: true, lowercase: true },
    phone:         { type: String, default: '', trim: true },
    country:       { type: String, default: '', trim: true },
    service:       { type: String, default: '', trim: true },
    preferredDate: { type: String, default: '', trim: true },
    message:       { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

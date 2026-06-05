const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    role:      { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    exp:       { type: String, required: true, trim: true },
    hospital:  { type: String, required: true, trim: true },
    rating:    { type: Number, default: 4.5, min: 1, max: 5 },
    bio:       { type: String, default: '', trim: true },
    image:     { type: String, default: '' },
    langs:     { type: String, default: '', trim: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);

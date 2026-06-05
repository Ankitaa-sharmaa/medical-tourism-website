const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title:     { type: String, required: true, trim: true },
    category:  {
      type: String, required: true, trim: true,
      enum: ['Surgery', 'Dental', 'Eye', 'Wellness'],
    },
    desc:      { type: String, required: true, trim: true },
    features:  [{ type: String, trim: true }],
    from:      { type: String, default: '', trim: true },
    tag:       { type: String, default: '', trim: true },
    available: { type: Boolean, default: true },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);

const Doctor = require('../models/Doctor');

// GET /api/doctors
const getDoctors = async (req, res) => {
  try {
    const limit   = parseInt(req.query.limit) || 0;
    const doctors = await Doctor.find().sort({ createdAt: -1 }).limit(limit);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/doctors  (protected)
const createDoctor = async (req, res) => {
  try {
    const { name, role, specialty, exp, hospital, rating, bio, image, langs, available } = req.body;
    const doctor = await Doctor.create({ name, role, specialty, exp, hospital, rating, bio, image, langs, available });
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/doctors/:id  (protected)
const updateDoctor = async (req, res) => {
  try {
    const { name, role, specialty, exp, hospital, rating, bio, image, langs, available } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, role, specialty, exp, hospital, rating, bio, image, langs, available },
      { new: true, runValidators: true }
    );
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/doctors/:id  (protected)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/doctors/upload  (protected)
// Converts the uploaded buffer to a base64 data URL so the image persists in
// MongoDB rather than relying on Vercel's ephemeral /tmp filesystem.
const uploadImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const b64 = req.file.buffer.toString('base64');
    res.json({ url: `data:${req.file.mimetype};base64,${b64}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDoctors, createDoctor, updateDoctor, deleteDoctor, uploadImage };

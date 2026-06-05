const Appointment = require('../models/Appointment');

// GET /api/appointments  (protected)
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/appointments  (public — consultation form)
const createAppointment = async (req, res) => {
  try {
    const { fullName, email, phone, country, service, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ message: 'fullName, email, and message are required' });
    }
    const appointment = await Appointment.create({ fullName, email, phone, country, service, message });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/appointments/:id  (protected — status update only)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status must be pending, approved, or rejected' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/appointments/:id  (protected)
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAppointments, createAppointment, updateStatus, deleteAppointment };

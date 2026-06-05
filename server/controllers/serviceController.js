const Service = require('../models/Service');

// GET /api/services  (public)
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/services  (protected)
const createService = async (req, res) => {
  try {
    const { title, category, desc, features, from, tag, available, order } = req.body;
    if (!title || !category || !desc) {
      return res.status(400).json({ message: 'title, category, and desc are required' });
    }
    const service = await Service.create({ title, category, desc, features, from, tag, available, order });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/services/:id  (protected)
const updateService = async (req, res) => {
  try {
    const { title, category, desc, features, from, tag, available, order } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, category, desc, features, from, tag, available, order },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/services/:id  (protected)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getServices, createService, updateService, deleteService };

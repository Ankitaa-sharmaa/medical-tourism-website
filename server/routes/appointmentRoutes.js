const express = require('express');
const {
  getAppointments, createAppointment, updateStatus, deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/',       protect, getAppointments);
router.post('/',      createAppointment);          // public — consultation form
router.patch('/:id',  protect, updateStatus);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;

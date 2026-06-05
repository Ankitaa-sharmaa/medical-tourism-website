const express = require('express');
const {
  getDoctors, createDoctor, updateDoctor, deleteDoctor, uploadImage,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const upload    = require('../middleware/upload');

const router = express.Router();

// image upload must be registered before the generic POST /
router.post('/upload', protect, upload.single('image'), uploadImage);

router.get('/',        getDoctors);
router.post('/',       protect, createDoctor);
router.put('/:id',     protect, updateDoctor);
router.delete('/:id',  protect, deleteDoctor);

module.exports = router;

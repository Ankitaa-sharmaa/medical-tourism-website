const express    = require('express');
const { login, verify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login',  login);
router.get('/verify',  protect, verify);

module.exports = router;

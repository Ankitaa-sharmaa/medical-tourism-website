const jwt = require('jsonwebtoken');

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const emailMatch    = email.trim().toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
  const passwordMatch = password === process.env.ADMIN_PASSWORD;

  if (!emailMatch || !passwordMatch) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const token = jwt.sign(
    { email: process.env.ADMIN_EMAIL, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({ token, email: process.env.ADMIN_EMAIL });
};

// GET /api/auth/verify  (protected — just confirms token is valid)
const verify = (req, res) => {
  res.json({ valid: true, email: req.admin.email });
};

module.exports = { login, verify };

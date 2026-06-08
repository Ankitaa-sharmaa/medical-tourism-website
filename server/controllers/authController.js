const jwt = require('jsonwebtoken');

// Read from Vercel env vars; fall back to defaults so dev still works.
// Trim both values to handle accidental leading/trailing spaces.
const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL    || 'ankita.dev.work@gmail.com').trim().toLowerCase();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '123456').trim();

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (
    email.trim().toLowerCase() === ADMIN_EMAIL &&
    password.trim() === ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    return res.json({ token, email: ADMIN_EMAIL });
  }

  return res.status(401).json({ message: 'Incorrect email or password' });
};

// GET /api/auth/verify  (protected — just confirms token is valid)
const verify = (req, res) => {
  res.json({ valid: true, email: req.admin.email });
};

module.exports = { login, verify };

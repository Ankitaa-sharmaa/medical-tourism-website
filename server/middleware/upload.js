const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Use /tmp on read-only file systems (Vercel), local uploads/ otherwise
let uploadDir = path.join(__dirname, '..', 'uploads');
try {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
} catch {
  uploadDir = '/tmp/uploads';
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedExts  = /\.(jpeg|jpg|png|webp)$/i;
  const allowedMimes = /^image\/(jpeg|png|webp)$/;
  if (allowedExts.test(file.originalname) && allowedMimes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

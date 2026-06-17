const multer = require('multer');

const fileFilter = (_req, file, cb) => {
  const allowedExts  = /\.(jpeg|jpg|png|webp)$/i;
  const allowedMimes = /^image\/(jpeg|png|webp)$/;
  if (allowedExts.test(file.originalname) && allowedMimes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
  }
};

// Memory storage — converts to base64 in controller so images persist in MongoDB
// instead of the ephemeral /tmp filesystem on Vercel.
module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB → ~2.7 MB as base64
});

const multer = require('multer');
const fs = require('fs');

const UPLOADS_DIR = process.env.UPLOADS_DIR || 'upload';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

// 🔥 THIS must be multer itself
const upload = multer({ storage });

// ✅ EXPORT MULTER DIRECTLY
module.exports = upload;

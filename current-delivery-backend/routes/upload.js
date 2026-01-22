const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const UP = process.env.UPLOADS_DIR || 'uploads';
if (!fs.existsSync(UP)) fs.mkdirSync(UP, { recursive: true });
const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, UP), filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage });


router.post('/', upload.single('file'), (req, res) => {
if (!req.file) return res.status(400).json({ error: 'No file' });
res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});
module.exports = router;
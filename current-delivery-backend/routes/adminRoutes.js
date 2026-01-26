// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');
const Shipment = require('../model/Shipment');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// =======================
// Admin Signup
// POST /api/admin/signup
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
      role: "admin"
    });

    res.status(201).json({ msg: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// =======================
// Admin Login
// POST /api/admin/login
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// =======================
// Admin sets shipment ON HOLD
// PATCH /api/admin/:id/hold
// =======================
router.patch('/:id/hold', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });

    shipment.status = 'on_hold';
    shipment.history.push({
      status: 'on_hold',
      timestamp: new Date(),
      reason
    });

    await shipment.save();

    res.json({ msg: "Shipment placed on hold", shipment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// =======================
// Admin resumes shipment
// PATCH /api/admin/:id/resume
// =======================
router.patch('/:id/resume', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status = 'in_transit' } = req.body;
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) return res.status(404).json({ msg: "Shipment not found" });

    shipment.status = status;
    shipment.history.push({
      status,
      timestamp: new Date()
    });

    await shipment.save();
    res.json({ msg: "Shipment resumed", shipment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

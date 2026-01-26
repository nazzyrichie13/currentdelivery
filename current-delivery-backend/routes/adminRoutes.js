import express from 'express';
import Admin from '../model/Admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Admin Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if admin exists
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashed });

    res.status(201).json({ msg: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// Admin sets shipment ON HOLD
router.patch('/:id/hold', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    shipment.status = 'on_hold';

    shipment.history.push({
      status: 'on_hold',
      timestamp: new Date(),
      reason
    });

    await shipment.save();

    res.json({
      message: 'Shipment placed on hold',
      shipment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Admin resumes shipment
router.patch('/:id/resume', authMiddleware, isAdmin, async (req, res) => {
  const { status = 'in_transit' } = req.body;

  const shipment = await Shipment.findById(req.params.id);
  shipment.status = status;

  shipment.history.push({
    status,
    timestamp: new Date()
  });

  await shipment.save();
  res.json(shipment);
});


export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

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

export default router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');



router.post('/register', async (req, res) => {
const { name, email, password, role } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ error: 'Email exists' });
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const user = await User.create({ name, email, passwordHash: hash, role: role || 'user' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});


router.post('/login', async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});


module.exports = router;


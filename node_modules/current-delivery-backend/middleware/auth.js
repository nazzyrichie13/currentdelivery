const jwt = require('jsonwebtoken');
const User = require('../model/User');


async function authMiddleware(req, res, next) {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ error: 'No token' });
const token = header.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(payload.id).select('-passwordHash');
if (!user) return res.status(401).json({ error: 'Invalid token' });
req.user = user;
next();
} catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
}


function isAdmin(req, res, next) {
if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
next();
}


module.exports = { authMiddleware, isAdmin };


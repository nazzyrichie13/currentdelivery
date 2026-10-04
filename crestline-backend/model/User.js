const { Schema, model } = require('mongoose');
const UserSchema = new Schema({
name: String,
email: { type: String, unique: true },
passwordHash: String,
role: { type: String, enum: ['user','admin','driver'], default: 'user' },
avatarUrl: String
}, { timestamps: true });
module.exports = model('User', UserSchema);


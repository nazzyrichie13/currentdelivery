const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Export the model
module.exports = model("Admin", adminSchema);

const { Schema, model: m } = require('mongoose');

/**
 * Stores approved reschedule history (admin-approved only)
 */
const rescheduleRequestSchema = new mongoose.Schema({
  requestedDate: Date,
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
/**
 * Stores user-initiated reschedule requests (pending approval)
 */
const RescheduleRequestSchema = new Schema({
  requestedDate: { type: Date, required: true },
  reason: String,
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: String,
  createdAt: { type: Date, default: Date.now }
});

const ShipmentSchema = new Schema({
  trackingCode: { type: String, unique: true, index: true },

  sender: {
    name: String,
    email: String,
    phone: String,
    address: String
  },

  recipient: {
    name: String,
    email: String,
    phone: String,
    address: String
  },

  package: {
    description: String,
    weight: Number,
    dimensions: {
      l: Number,
      w: Number,
      h: Number
    },
    imageUrl: String
  },

  price: Number,

  status: {
    type: String,
     enum: [
    'created',
    'scheduled',
    'rescheduled',
    'in_transit',
    'on_hold',        // ✅ NEW
    'out_for_delivery',
    'delivered',
    'cancelled'
  ],
    default: 'created'
  },

  deliveryDate: Date,

  location: {
  text: String,           // 👈 ADD THIS
  coords: {
    lat: Number,
    lng: Number
  },
  updatedAt: Date
},


  history: [
    {
      status: String,
      location: Object,
      timestamp: { type: Date, default: Date.now }
    }
  ],

  // 🔁 Admin-approved reschedule log
  rescheduleRequests: [rescheduleRequestSchema],

  reschedules: [
    {
      oldDate: Date,
      newDate: Date,
      reason: String,
      rescheduledBy: mongoose.Schema.Types.ObjectId
    }
  ],
  invoiceId: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice'
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true });

module.exports = m('Shipment', ShipmentSchema);

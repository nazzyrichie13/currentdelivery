const { Schema, model } = require('mongoose');

/**
 * 🔁 User reschedule requests (pending / approved / rejected)
 * Used inside Shipment
 */
const RescheduleRequestSchema = new Schema({
  requestedDate: {
    type: Date,
    required: true
  },
  reason: String,
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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
 * 📦 Shipment Schema
 */
const ShipmentSchema = new Schema(
  {
    trackingCode: {
      type: String,
      unique: true,
      index: true
    },

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

    // 📦 PACKAGE DETAILS
    package: {
      description: String,
      weight: Number,

      serviceType: {
        type: String,
        enum: ['box', 'envelope', 'pallet'],
        required: true
      },

      quantity: {
        type: Number,
        default: 1,
        min: 1
      },

      dimensions: {
        l: Number,
        w: Number,
        h: Number
      },

      imageUrl: String
    },

    // 🚚 SHIPPING SERVICE
    shippingService: {
      type: String,
      enum: ['standard', 'express', 'same_day'],
      default: 'standard'
    },

    price: Number,

    status: {
      type: String,
      enum: [
        'created',
        'scheduled',
        'rescheduled',
        'in_transit',
        'on_hold',
        'out_for_delivery',
        'delivered',
        'cancelled'
      ],
      default: 'created'
    },

    // 📅 DELIVERY DATES
    deliveryDate: Date,
    expectedDeliveryDate: Date,

    // 📍 CURRENT LOCATION
    location: {
      text: String,
      coords: {
        lat: Number,
        lng: Number
      },
      updatedAt: Date
    },

    // 🎯 DESTINATION
    destination: {
      text: String,
      coords: {
        lat: Number,
        lng: Number
      }
    },

    // 🕒 TRACKING HISTORY
    history: [
      {
        status: String,
        location: Object,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // 🔁 RESCHEDULE REQUESTS (single source of truth)
    rescheduleRequests: [RescheduleRequestSchema],

    // ✅ ADMIN-APPROVED RESCHEDULE LOG
    reschedules: [
      {
        oldDate: Date,
        newDate: Date,
        reason: String,
        rescheduledBy: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        rescheduledAt: {
          type: Date,
          default: Date.now
        }
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
  },
  { timestamps: true }
);

module.exports = model('Shipment', ShipmentSchema);

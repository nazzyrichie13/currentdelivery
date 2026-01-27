const mongoose = require("mongoose")
const InvoiceSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment'
    },
    invoiceNumber: String,
    amount: Number,
    currency: { type: String, default: 'USD' },
    items: [
      {
        name: String,
        price: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);

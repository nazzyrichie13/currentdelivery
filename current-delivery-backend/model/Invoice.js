const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const InvoiceSchema = new mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: true
    },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    items: [InvoiceItemSchema],
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'bank_transfer'],
      default: 'cash'
    },
    dueDate: { type: Date }, // optional, e.g., 7 days after creation
    companyName: { type: String, default: 'CurrentDelivery Company' },
    companyLogo: { type: String, default: '/logo.png' }, // path in /public
    taxId: { type: String, default: '123-456-789' },
    legalDisclaimer: { type: String, default: 'All shipments are subject to terms and conditions. Company is not liable for delays caused by weather, customs, or third-party carriers.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);

const { Schema: S, model: M } = require('mongoose');
const InvoiceSchema = new S({ shipmentId: { type: S.Types.ObjectId, ref: 'Shipment' }, invoiceNumber: String, pdfUrl: String, createdAt: { type: Date, default: Date.now } });
module.exports = M('Invoice', InvoiceSchema);
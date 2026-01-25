const express3 = require('express');
const r3 = express3.Router();
const Shipment3 = require('../model/Shipment');
const Invoice3 = require('../model/Invoice');


r3.get('/:trackingCode', async (req, res) => {
const code = req.params.trackingCode;
const shipment = await Shipment3.findOne({ trackingCode: code }).populate('invoiceId');
if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
res.json({ trackingCode: shipment.trackingCode, status: shipment.status, sender: shipment.sender, recipient: shipment.recipient, package: shipment.package, price: shipment.price, invoice: shipment.invoiceId ? shipment.invoiceId.pdfUrl : null, location: shipment.location, history: shipment.history });
});


module.exports = r3;
const express4 = require('express');
const r4 = express4.Router();
const Invoice4 = require('../model/Invoice');


r4.get('/:invoiceNumber', async (req, res) => {
const inv = await Invoice4.findOne({ invoiceNumber: req.params.invoiceNumber });
if (!inv) return res.status(404).json({ error: 'Invoice not found' });
// redirect to static pdf
res.redirect(inv.pdfUrl);
});


module.exports = r4;
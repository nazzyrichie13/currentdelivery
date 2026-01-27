const router = require('express').Router();
const Invoice = require('../models/Invoice');
const Shipment = require('../models/Shipment');
const PDFDocument = require('pdfkit');

router.get('/download/:trackingCode', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingCode: req.params.trackingCode
    }).populate('invoiceId');

    if (!shipment || !shipment.invoiceId) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = shipment.invoiceId;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    // HEADER
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Tracking Code: ${shipment.trackingCode}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toDateString()}`);
    doc.moveDown();

    // CUSTOMER
    doc.text(`Sender: ${shipment.sender.name}`);
    doc.text(`Recipient: ${shipment.recipient.name}`);
    doc.moveDown();

    // ITEMS
    doc.text('Items:', { underline: true });
    invoice.items.forEach(item => {
      doc.text(`${item.name} - $${item.price}`);
    });

    doc.moveDown();
    doc.text(`Total: $${invoice.amount}`, { bold: true });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

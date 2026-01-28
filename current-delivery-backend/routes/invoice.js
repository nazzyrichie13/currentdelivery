const router = require('express').Router();
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const path = require('path');

const Shipment = require('../models/Shipment');
const Invoice = require('../models/Invoice');

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

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // === COMPANY LOGO & NAME ===
    const logoPath = path.join(__dirname, '../public', invoice.companyLogo);
    try { doc.image(logoPath, 50, 45, { width: 100 }); } catch(e){}

    doc.fontSize(18).text(invoice.companyName, 160, 50);
    doc.fontSize(10).text(`Tax ID: ${invoice.taxId}`, 160, 70);

    // === INVOICE HEADER ===
    doc.fontSize(20).text('INVOICE', 400, 50, { align: 'right' });
    doc.fontSize(10).text(`Invoice #: ${invoice.invoiceNumber}`, 400, 80, { align: 'right' });
    doc.text(`Date: ${new Date(invoice.createdAt).toDateString()}`, 400, 95, { align: 'right' });
    if(invoice.dueDate) doc.text(`Due Date: ${new Date(invoice.dueDate).toDateString()}`, 400, 110, { align: 'right' });

    // === BARCODE ===
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: shipment.trackingCode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center'
    });
    doc.image(barcodeBuffer, 200, 130, { width: 200 });
    doc.moveDown(4);

    // === SHIPMENT & ADDRESS INFO ===
    doc.fontSize(12).text(`Tracking #: ${shipment.trackingCode}`);
    doc.text(`Pickup Date: ${shipment.createdAt.toDateString()}`);
    doc.moveDown(1);

    doc.text('Sender (Origin):', { underline: true });
    doc.text(`${shipment.sender.name}`);
    doc.text(`${shipment.sender.address}`);
    doc.text(`Phone: ${shipment.sender.phone}`);
    doc.moveDown(0.5);

    doc.text('Recipient (Destination):', { underline: true });
    doc.text(`${shipment.recipient.name}`);
    doc.text(`${shipment.destination?.text || shipment.recipient.address}`);
    doc.text(`Phone: ${shipment.recipient.phone}`);
    doc.moveDown(1);

    // === PACKAGE DETAILS ===
    doc.text('Package Details:', { underline: true });
    doc.text(`Description: ${shipment.package.description}`);
    doc.text(`Service Type: ${shipment.package.serviceType}`);
    doc.text(`Quantity: ${shipment.package.quantity}`);
    doc.text(`Weight: ${shipment.package.weight} kg`);
    if (shipment.package.imageUrl) {
      try { doc.image(path.join(__dirname, '../public', shipment.package.imageUrl), { width: 150 }); } catch(e){}
    }
    doc.moveDown(1);

    // === ITEMS / CHARGES ===
    doc.text('Charges:', { underline: true });
    invoice.items.forEach(item => {
      doc.text(`${item.name}: $${item.price.toFixed(2)}`);
    });
    doc.moveDown(0.5);
    doc.text(`Total Amount: $${invoice.amount.toFixed(2)}`, { bold: true });
    doc.moveDown(1);

    // === PAYMENT DETAILS ===
    doc.text('Payment Details:', { underline: true });
    doc.text(`Method: ${invoice.paymentMethod}`);
    doc.text(`Sender: ${shipment.sender.name}`);
    doc.moveDown(1);

    // === LEGAL DISCLAIMER ===
    doc.text('Legal Disclaimer:', { underline: true });
    doc.text(invoice.legalDisclaimer);

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

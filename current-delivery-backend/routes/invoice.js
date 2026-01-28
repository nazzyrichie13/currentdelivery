const router = require('express').Router();
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const path = require('path');
const fs = require('fs');

const Shipment = require('../model/Shipment');
const Invoice = require('../model/Invoice');

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

    /* =========================
       HEADER (COLORED)
    ========================== */
    doc
      .rect(0, 0, doc.page.width, 120)
      .fill('#0f766e'); // teal

    const logoPath = path.join(__dirname, '../public', invoice.companyLogo || '');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 90 });
    }

    doc
      .fillColor('white')
      .fontSize(20)
      .text(invoice.companyName || 'CurrentDelivery Company', 160, 35);

    doc
      .fontSize(10)
      .text(`Tax ID: ${invoice.taxId || 'N/A'}`, 160, 65);

    doc
      .fontSize(22)
      .text('INVOICE', 400, 40, { align: 'right' });

    doc
      .fontSize(10)
      .text(`Invoice #: ${invoice.invoiceNumber}`, 400, 70, { align: 'right' })
      .text(`Date: ${new Date(invoice.createdAt).toDateString()}`, 400, 85, { align: 'right' })
      .text(
        `Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toDateString() : 'N/A'}`,
        400,
        100,
        { align: 'right' }
      );

    /* =========================
       BARCODE
    ========================== */
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',
      text: shipment.trackingCode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center'
    });

    doc.image(barcodeBuffer, 200, 135, { width: 200 });

    /* =========================
       INFO CARD
    ========================== */
    doc
      .rect(40, 200, doc.page.width - 80, 90)
      .fill('#f1f5f9');

    doc
      .fillColor('#0f172a')
      .fontSize(11)
      .text(`Tracking Code: ${shipment.trackingCode}`, 60, 215)
      .text(`Pickup Date: ${shipment.createdAt.toDateString()}`, 60, 235)
      .text(`Service: ${shipment.shippingService}`, 60, 255);

    /* =========================
       ADDRESSES
    ========================== */
    doc
      .rect(40, 305, doc.page.width - 80, 130)
      .fill('#ecfeff');

    doc
      .fillColor('#164e63')
      .fontSize(14)
      .text('Shipment Information', 60, 320);

    doc
      .fontSize(11)
      .fillColor('#0f172a')
      .text(`Sender: ${shipment.sender.name}`, 60, 350)
      .text(`Origin: ${shipment.sender.address}`, 60, 365)
      .text(`Phone: ${shipment.sender.phone}`, 60, 380);

    doc
      .text(`Recipient: ${shipment.recipient.name}`, 330, 350)
      .text(
        `Destination: ${shipment.destination?.text || shipment.recipient.address}`,
        330,
        365
      )
      .text(`Phone: ${shipment.recipient.phone}`, 330, 380);

    /* =========================
       PACKAGE DETAILS
    ========================== */
    doc
      .rect(40, 450, doc.page.width - 80, 110)
      .fill('#f8fafc');

    doc
      .fillColor('#1e293b')
      .fontSize(14)
      .text('Package Details', 60, 465);

    doc
      .fontSize(11)
      .text(`Description: ${shipment.package.description}`, 60, 495)
      .text(`Package Type: ${shipment.package.serviceType}`, 60, 510)
      .text(`Quantity: ${shipment.package.quantity}`, 60, 525)
      .text(`Weight: ${shipment.package.weight} kg`, 60, 540);

    if (shipment.package.imageUrl) {
      const imgPath = path.join(__dirname, '../public', shipment.package.imageUrl);
      if (fs.existsSync(imgPath)) {
        doc.image(imgPath, 350, 485, { width: 120 });
      }
    }

    /* =========================
       CHARGES
    ========================== */
    doc
      .rect(40, 575, doc.page.width - 80, 120)
      .fill('white')
      .stroke('#c7d2fe');

    doc
      .fillColor('#1e3a8a')
      .fontSize(14)
      .text('Charges', 60, 590);

    let y = 620;
    invoice.items.forEach(item => {
      doc
        .fontSize(11)
        .fillColor('#0f172a')
        .text(item.name, 60, y)
        .text(`$${item.price.toFixed(2)}`, 450, y);
      y += 20;
    });

    doc
      .fontSize(12)
      .fillColor('#020617')
      .text(`Total: $${invoice.amount.toFixed(2)}`, 60, y + 10);

    /* =========================
       PAYMENT
    ========================== */
    doc
      .rect(40, y + 40, doc.page.width - 80, 80)
      .fill('#fef3c7');

    doc
      .fillColor('#92400e')
      .fontSize(12)
      .text(`Payment Method: ${invoice.paymentMethod}`, 60, y + 55)
      .text(`Paid By: ${shipment.sender.name}`, 60, y + 75);

    /* =========================
       FOOTER
    ========================== */
    doc
      .fontSize(9)
      .fillColor('#475569')
      .text(
        invoice.legalDisclaimer ||
          'All shipments are subject to company terms and liability limitations.',
        40,
        doc.page.height - 60,
        { align: 'center' }
      );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

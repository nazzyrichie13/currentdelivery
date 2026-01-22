const express2 = require('express');
const router2 = express2.Router();
const multer = require('multer');
const fs2 = require('fs');
const path2 = require('path');
const Shipment = require('../model/Shipment');
const Invoice = require('../model/Invoice');
const User = require('../model/User');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { generateInvoicePDF } = require('../utilis/pdf');


const UP2 = process.env.UPLOADS_DIR || 'uploads';
if (!fs2.existsSync(UP2)) fs2.mkdirSync(UP2, { recursive: true });
const storage2 = multer.diskStorage({ destination: (req, file, cb) => cb(null, UP2), filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload2 = multer({ storage: storage2 });


// Admin creates shipment -> generate invoice + email
router2.post(
  '/',
  authMiddleware,
  isAdmin,
  upload2.single('packageImage'), // handles single file upload
  async (req, res) => {
    try {
      const body = req.body;

      // Parse sender & recipient JSON
      const sender = JSON.parse(body.sender);
      const recipient = JSON.parse(body.recipient);

      // Handle uploaded image
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      // Generate unique tracking code
      const trackingCode = 'CD' + Date.now().toString(36).toUpperCase();

      // Convert numeric fields safely
      const weight = parseFloat(body.weight) || 0;
      const price = parseFloat(body.price) || 0;

      // Create shipment record
      const shipment = await Shipment.create({
        trackingCode,
        sender,
        recipient,
        package: { description: body.description, weight, imageUrl },
        price,
        status: 'created',
        createdBy: req.user._id,
      });

      // Create invoice
      const invoiceNumber = 'INV-' + Date.now();
      const { filePath, pdfUrl } = await generateInvoicePDF({ shipment, invoiceNumber });
      const invoice = await Invoice.create({
        shipmentId: shipment._id,
        invoiceNumber,
        pdfUrl,
      });

      // Link invoice to shipment
      shipment.invoiceId = invoice._id;
      await shipment.save();

      // Send invoice email (optional)
      const sendEmail = require('./email').sendInvoiceEmail;
      try {
        await sendEmail(
          recipient.email,
          `Your shipment ${shipment.trackingCode}`,
          `Your invoice is ready.`,
          [{ filename: `${invoiceNumber}.pdf`, path: filePath }]
        );
      } catch (e) {
        console.warn('Email sending failed:', e.message);
      }

      res.json({ shipment, invoice });
    } catch (err) {
      console.error('Shipment creation error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);


// Admin edit shipment
router2.put('/:id', authMiddleware, isAdmin, async (req, res) => {
try {
const updated = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);
} catch (e) { res.status(500).json({ error: e.message }); }
});


// Admin list shipments
router2.get('/', authMiddleware, isAdmin, async (req, res) => {
const q = {};
const shipments = await Shipment.find(q).sort({ createdAt: -1 }).limit(200);
res.json(shipments);
});


// Get single shipment (admin)
router2.get('/:id', authMiddleware, async (req, res) => {
const s = await Shipment.findById(req.params.id).populate('invoiceId');
res.json(s);
});
  

// Admin approve or reject user reschedule request
router2.patch('/:shipmentId/reschedule-request/:requestId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { action, adminNote } = req.body; // approve | reject

    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

    const request = shipment.rescheduleRequests.id(req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    if (action === 'approve') {
      shipment.reschedules.push({
        oldDate: shipment.deliveryDate,
        newDate: request.requestedDate,
        reason: request.reason,
        rescheduledBy: req.user._id
      });

      shipment.deliveryDate = request.requestedDate;
      shipment.status = 'rescheduled';
      request.status = 'approved';
    } else {
      request.status = 'rejected';
      request.adminNote = adminNote;
    }

    await shipment.save();

    res.json({
      message: `Request ${request.status}`,
      shipment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router2;
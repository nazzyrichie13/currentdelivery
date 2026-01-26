const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Shipment = require('../model/Shipment');
const Invoice = require('../model/Invoice');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { generateInvoicePDF } = require('../utilis/pdf');
const sendInvoiceEmail = require('./email').sendInvoiceEmail;

// Set up uploads directory
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer storage for single file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ====================
// CREATE SHIPMENT
// POST /api/shipment
// ====================
router.post(
  '/',
  authMiddleware,
  isAdmin,
  upload.single('packageImage'),
  async (req, res) => {
    try {
      const { sender, recipient, description, weight, price } = req.body;

      // Parse sender & recipient JSON if sent as strings
      const senderData = typeof sender === 'string' ? JSON.parse(sender) : sender;
      const recipientData = typeof recipient === 'string' ? JSON.parse(recipient) : recipient;

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const trackingCode = 'CD' + Date.now().toString(36).toUpperCase();

      const shipment = await Shipment.create({
        trackingCode,
        sender: senderData,
        recipient: recipientData,
        package: { description, weight: parseFloat(weight) || 0, imageUrl },
        price: parseFloat(price) || 0,
        status: 'created',
        createdBy: req.user._id
      });

      // Generate invoice PDF
      const invoiceNumber = 'INV-' + Date.now();
      const { filePath, pdfUrl } = await generateInvoicePDF({ shipment, invoiceNumber });

      const invoice = await Invoice.create({
        shipmentId: shipment._id,
        invoiceNumber,
        pdfUrl
      });

      shipment.invoiceId = invoice._id;
      await shipment.save();

      // Send invoice email
      try {
        await sendInvoiceEmail(
          recipientData.email,
          `Your shipment ${shipment.trackingCode}`,
          `Your invoice is ready.`,
          [{ filename: `${invoiceNumber}.pdf`, path: filePath }]
        );
      } catch (e) {
        console.warn('Email sending failed:', e.message);
      }

      res.status(201).json({ shipment, invoice });
    } catch (err) {
      console.error('Shipment creation error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ====================
// EDIT SHIPMENT
// PUT /api/shipment/:id
// ====================
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const updated = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// LIST SHIPMENTS
// GET /api/shipment
// ====================
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const shipments = await Shipment.find({}).sort({ createdAt: -1 }).limit(200);
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// GET SINGLE SHIPMENT
// GET /api/shipment/:id
// ====================
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('invoiceId');
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// RESCHEDULE REQUEST APPROVAL/REJECTION
// PATCH /api/shipment/:shipmentId/reschedule-request/:requestId
// ====================
router.patch('/:shipmentId/reschedule-request/:requestId', authMiddleware, isAdmin, async (req, res) => {
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

    res.json({ message: `Request ${request.status}`, shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

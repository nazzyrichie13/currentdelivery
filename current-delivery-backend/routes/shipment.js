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

// ====================
// UPLOAD CONFIG
// ====================
const UPLOADS_DIR = process.env.UPLOADS_DIR || 'uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
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

      const senderData =
        typeof sender === 'string' ? JSON.parse(sender) : sender;
      const recipientData =
        typeof recipient === 'string' ? JSON.parse(recipient) : recipient;

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const trackingCode = `CD${Date.now().toString(36).toUpperCase()}`;

      const shipment = await Shipment.create({
        trackingCode,
        sender: senderData,
        recipient: recipientData,
        package: {
          description,
          weight: parseFloat(weight) || 0,
          imageUrl
        },
        price: parseFloat(price) || 0,
        status: 'created',
        createdBy: req.user._id
      });

      // Generate invoice
      const invoiceNumber = `INV-${Date.now()}`;
      const { filePath, pdfUrl } = await generateInvoicePDF({
        shipment,
        invoiceNumber
      });

      const invoice = await Invoice.create({
        shipmentId: shipment._id,
        invoiceNumber,
        pdfUrl
      });

      shipment.invoiceId = invoice._id;
      await shipment.save();

      // Email (non-blocking)
      sendInvoiceEmail(
        recipientData.email,
        `Your shipment ${shipment.trackingCode}`,
        'Your invoice is ready.',
        [{ filename: `${invoiceNumber}.pdf`, path: filePath }]
      ).catch(e =>
        console.warn('Invoice email failed:', e.message)
      );

      res.status(201).json({ shipment, invoice });
    } catch (err) {
      console.error('Shipment creation error:', err);
      res.status(500).json({ error: err.message });
    }
  }
);


// ====================
// TRACK SHIPMENT (PUBLIC)
// GET /api/shipment/track/:trackingCode
// ====================
router.get('/track/:trackingCode', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingCode: req.params.trackingCode
    }).lean();

    if (!shipment) {
      return res
        .status(404)
        .json({ error: 'Shipment not found yet' });
    }

    res.json({ shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ====================
// EDIT SHIPMENT
// PUT /api/shipment/:id
// ====================
// ====================


// ====================
// LIST SHIPMENTS
// GET /api/shipment
// ====================
router.get('/', authMiddleware, isAdmin, async (_, res) => {
  try {
    const shipments = await Shipment.find({})
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// UPDATE SHIPMENT BY TRACKING CODE
// PUT /api/shipment/track/:trackingCode
// ====================
router.put('/track/:trackingCode', authMiddleware, isAdmin, async (req, res) => {
  try {
    const updated = await Shipment.findOneAndUpdate(
      { trackingCode: req.params.trackingCode.toUpperCase() },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }

    res.json(updated);
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
    const shipment = await Shipment
      .findById(req.params.id)
      .populate('invoiceId');

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ====================
// RESCHEDULE REQUEST DECISION
// PATCH /api/shipment/:shipmentId/reschedule-request/:requestId
// ====================
router.patch(
  '/track/:trackingCode/reschedule-request/:requestId',
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const { action, adminNote } = req.body;

      const shipment = await Shipment.findOne({
        trackingCode: req.params.trackingCode
      });

      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const request = shipment.rescheduleRequests.id(req.params.requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

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
  }
);

router.post(
  '/track/:trackingCode/reschedule-request',
  authMiddleware, // customer must be logged in
  async (req, res) => {
    try {
      const { requestedDate, reason } = req.body;

      const shipment = await Shipment.findOne({
        trackingCode: req.params.trackingCode
      });

      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      // prevent multiple pending requests
      const hasPending = shipment.rescheduleRequests.some(
        r => r.status === 'pending'
      );

      if (hasPending) {
        return res
          .status(400)
          .json({ error: 'Pending reschedule request already exists' });
      }

      shipment.rescheduleRequests.push({
        requestedDate,
        reason
      });

      await shipment.save();

      res.status(201).json({
        message: 'Reschedule request submitted',
        shipment
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


module.exports = router;

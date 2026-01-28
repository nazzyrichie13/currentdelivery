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
      // 🔹 Parse JSON fields from FormData
      const sender =
        typeof req.body.sender === 'string'
          ? JSON.parse(req.body.sender)
          : req.body.sender;

      const recipient =
        typeof req.body.recipient === 'string'
          ? JSON.parse(req.body.recipient)
          : req.body.recipient;

      const destination = req.body.destination
        ? JSON.parse(req.body.destination)
        : { text: req.body.destination };

      const location = req.body.location
        ? JSON.parse(req.body.location)
        : null;

      // 🔹 Package & shipment fields
      const {
        description,
        weight,
        price,
        packageType,
        quantity,
        shippingService,
        expectedDeliveryDate
      } = req.body;

      // 🔹 Image
      const imageUrl = req.file
  ? `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
  : undefined;


      // 🔹 Tracking code
      const trackingCode = `CD${Date.now().toString(36).toUpperCase()}`;

      // 🚚 CREATE SHIPMENT
      const shipment = await Shipment.create({
        trackingCode,
        sender,
        recipient,

        package: {
          description,
          weight: Number(weight) || 0,
          serviceType: packageType,
          quantity: Number(quantity) || 1,
          imageUrl
        },

        shippingService,
        expectedDeliveryDate:
          expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,

        destination,
        location,

        price: Number(price) || 0,
        status: 'created',
        createdBy: req.user._id,

        history: location
          ? [{ status: 'created', location }]
          : []
      });

      // 🧾 CREATE INVOICE
      const invoiceNumber = `INV-${Date.now()}`;
      const invoice = await Invoice.create({
        shipment: shipment._id,
        invoiceNumber,
        amount: shipment.price,
        items: [
          {
            name: `Shipping (${shipment.shippingService})`,
            price: shipment.price
          }
        ]
      });

      // 🧾 GENERATE PDF
      const { filePath, pdfUrl } = await generateInvoicePDF({
        shipment,
        invoice
      });

      invoice.pdfUrl = pdfUrl;
      await invoice.save();

      // 🔗 LINK INVOICE
      shipment.invoiceId = invoice._id;
      await shipment.save();

      // 📧 SEND EMAIL (non-blocking)
      if (recipient?.email) {
        sendInvoiceEmail(
          recipient.email,
          `Invoice for shipment ${shipment.trackingCode}`,
          'Your shipment invoice is attached.',
          [{ filename: `${invoiceNumber}.pdf`, path: filePath }]
        ).catch(err =>
          console.warn('Invoice email failed:', err.message)
        );
      }

      res.status(201).json({
        shipment,
        invoice
      });
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

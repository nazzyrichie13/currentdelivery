

// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require('path');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

/* =======================
   PATHS (DEFINE FIRST)
======================= */
const FRONTEND_DIST = path.join(__dirname, '../current-delivery-frontend', 'dist');
const INVOICES_DIR = path.join(__dirname, process.env.INVOICES_DIR || 'invoice');
const UPLOADS_DIR = path.join(__dirname, process.env.UPLOADS_DIR || 'upload');

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({ origin: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   STATIC FILES
======================= */
app.use(express.static(FRONTEND_DIST));
app.use('/invoices', express.static(INVOICES_DIR));
app.use('/upload', express.static(UPLOADS_DIR));

/* =======================
   API ROUTES
======================= */
app.use("/api/admin", require("./routes/adminRoutes"));
app.use('/api/auth/login',require('./routes/auth'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipment', require('./routes/shipment'));
app.use('/api/track', require('./routes/tracking'));
app.use('/api/invoice', require('./routes/invoice'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/email', require('./routes/email'));

/* =======================
   REACT FALLBACK (LAST)
======================= */
app.use((req, res, next) => { 
   if ( req.path.startsWith('/api') || req.path.startsWith('/invoices') || req.path.startsWith('/upload') )
   { return next(); } res.sendFile(path.join(FRONTEND_DIST, 'index.html')); });
/* =======================
   DATABASE
======================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error ❌', err));

/* =======================
   SOCKET.IO
======================= */
io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on('join_room', ({ room }) => {
    socket.join(room);
  });

  socket.on('chat_message', async (msg) => {
    const Chat = require('./models/Chat');
    const message = await Chat.create({
      chatId: msg.room,
      senderId: msg.senderId,
      senderName: msg.senderName,
      text: msg.text
    });
    io.to(msg.room).emit('chat_message', message);
  });

  socket.on('location_update', async (payload) => {
    const Shipment = require('./models/Shipment');
    const s = await Shipment.findOneAndUpdate(
      { trackingCode: payload.trackingCode },
      {
        location: { coords: payload.coords, updatedAt: new Date() },
        $push: { history: { status: payload.status || 'in_transit', location: payload.coords, timestamp: new Date() } }
      },
      { new: true }
    );
    io.to(`tracking_${payload.trackingCode}`).emit('location_update', s);
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

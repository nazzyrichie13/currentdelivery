


// server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

/* =======================
   SOCKET.IO
======================= */

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  }
});

/* =======================
   MIDDLEWARE
======================= */

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   PATHS
======================= */

// Backend-only folders.
// Frontend is hosted separately.
const INVOICES_DIR = path.join(
  __dirname,
  process.env.INVOICES_DIR || 'invoice'
);

const UPLOADS_DIR = path.join(
  __dirname,
  process.env.UPLOADS_DIR || 'upload'
);

/* =======================
   STATIC BACKEND FILES
======================= */

app.use(
  '/invoices',
  express.static(INVOICES_DIR)
);

app.use(
  '/upload',
  express.static(UPLOADS_DIR)
);

/* =======================
   API ROUTES
======================= */

app.use(
  '/api/admin',
  require('./routes/adminRoutes')
);

app.use(
  '/api/auth',
  require('./routes/auth')
);

app.use(
  '/api/shipment',
  require('./routes/shipment')
);

app.use(
  '/api/track',
  require('./routes/tracking')
);

app.use(
  '/api/invoice',
  require('./routes/invoice')
);

app.use(
  '/api/email',
  require('./routes/email')
);

/* =======================
   API 404 HANDLER
======================= */

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    msg: 'API route not found',
    path: req.originalUrl
  });
});

/* =======================
   GENERAL ERROR HANDLER
======================= */

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);

  res.status(err.status || 500).json({
    success: false,
    msg: err.message || 'Internal server error'
  });
});

/* =======================
   DATABASE
======================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
  })
  .catch((err) => {
    console.error('MongoDB error ❌', err);
  });

/* =======================
   SOCKET.IO
======================= */

const activeRooms = new Set();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  /* ==========================
     CHAT
  ========================== */

  // Client or Admin joins a room
  socket.on('join_room', ({ room, isAdmin }) => {
    if (!room) return;

    socket.join(room);

    console.log(
      `${isAdmin ? 'Admin' : 'Client'} joined room: ${room}`
    );

    if (!isAdmin) {
      activeRooms.add(room);

      io.emit(
        'update_rooms',
        Array.from(activeRooms)
      );
    }
  });

  // Admin dashboard joins
  socket.on('admin_join', () => {
    socket.emit(
      'update_rooms',
      Array.from(activeRooms)
    );
  });

  // Send chat messages
  socket.on('chat_message', (msg) => {
    if (!msg || !msg.room) return;

    const {
      room,
      isAdmin
    } = msg;

    // Send to everyone in the room
    io.to(room).emit(
      'chat_message',
      msg
    );

    // Notify admin dashboard if message is from client
    if (!isAdmin) {
      io.emit(
        'chat_message',
        msg
      );
    }
  });

  /* ==========================
     DISCONNECT
  ========================== */

  socket.on('disconnect', () => {
    console.log(
      'Socket disconnected:',
      socket.id
    );

    // Remove empty rooms
    activeRooms.forEach((room) => {
      const roomSockets =
        io.sockets.adapter.rooms.get(room);

      if (
        !roomSockets ||
        roomSockets.size === 0
      ) {
        activeRooms.delete(room);
      }
    });

    // Update admin dashboards
    io.emit(
      'update_rooms',
      Array.from(activeRooms)
    );
  });

  /* ==========================
     SHIPMENT LOCATION UPDATE
  ========================== */

  socket.on(
    'location_update',
    async (payload) => {
      try {
        if (!payload || !payload.trackingCode) {
          return;
        }

        const Shipment = require('./models/Shipment');

        const shipment =
          await Shipment.findOneAndUpdate(
            {
              trackingCode:
                payload.trackingCode
            },
            {
              location: {
                coords: payload.coords,
                updatedAt: new Date()
              },

              $push: {
                history: {
                  status:
                    payload.status ||
                    'in_transit',

                  location:
                    payload.coords,

                  timestamp:
                    new Date()
                }
              }
            },
            {
              new: true
            }
          );

        if (shipment) {
          io.to(
            `tracking_${payload.trackingCode}`
          ).emit(
            'location_update',
            shipment
          );
        }

      } catch (err) {
        console.error(
          'Error updating shipment location:',
          err
        );
      }
    }
  );
});

/* =======================
   START SERVER
======================= */

const PORT =
  process.env.PORT || 5000;

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT} 🚀`
    );

    console.log(
      'JWT_SECRET loaded:',
      !!process.env.JWT_SECRET
    );

    console.log(
      'MONGO_URI loaded:',
      !!process.env.MONGO_URI
    );
  }
);


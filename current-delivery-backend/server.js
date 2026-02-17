

// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require( "body-parser");
const axios = require("axios");
const fs = require("fs");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(bodyParser.json());
/* =======================
   PATHS
======================= */
const FRONTEND_DIST = path.join(__dirname, '../current-delivery-frontend', 'dist');
const INVOICES_DIR = path.join(__dirname, process.env.INVOICES_DIR || 'invoice');
const UPLOADS_DIR = path.join(__dirname, process.env.UPLOADS_DIR || 'upload');

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({ origin: '*' }));
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
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipment', require('./routes/shipment'));
app.use('/api/track', require('./routes/tracking'));
app.use('/api/invoice', require('./routes/invoice'));
app.use('/api/email', require('./routes/email'));

/* =======================
   REACT FALLBACK
======================= */
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/upload') ||
    req.path.startsWith('/invoices')
  ) {
    return next();
  }
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});
// server.js (or your Express setup)

const translationCache = {};

app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    ///////////////////////////////////////////////////////////
    // 1️⃣ VALIDATION
    ///////////////////////////////////////////////////////////

    if (!Array.isArray(text) || !targetLang) {
      return res.status(400).json({
        error: "Invalid payload. text[] and targetLang required."
      });
    }

    ///////////////////////////////////////////////////////////
    // 2️⃣ CACHE CHECK
    ///////////////////////////////////////////////////////////

    const cacheKey = JSON.stringify(text) + targetLang;

    if (translationCache[cacheKey]) {
      return res.json({
        translations: translationCache[cacheKey]
      });
    }

    ///////////////////////////////////////////////////////////
    // 3️⃣ ENGLISH FALLBACK
    ///////////////////////////////////////////////////////////

    if (targetLang === "en") {
      translationCache[cacheKey] = text;
      return res.json({ translations: text });
    }

    ///////////////////////////////////////////////////////////
    // 4️⃣ OPENAI CALL
    ///////////////////////////////////////////////////////////

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not set");
    }

    const prompt = `
Translate the following JSON array of English sentences to ${targetLang}.
Return ONLY a pure JSON array. No explanation.

${JSON.stringify(text)}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    ///////////////////////////////////////////////////////////
    // 5️⃣ SAFE PARSE
    ///////////////////////////////////////////////////////////

    let output =
      response?.data?.choices?.[0]?.message?.content || "[]";

    // Remove markdown if model adds it
    output = output.replace(/```json|```/g, "").trim();

    let translations;

    try {
      translations = JSON.parse(output);
    } catch {
      console.warn("Parse failed, using fallback");
      translations = text;
    }

    ///////////////////////////////////////////////////////////
    // 6️⃣ CACHE SAVE
    ///////////////////////////////////////////////////////////

    translationCache[cacheKey] = translations;

    ///////////////////////////////////////////////////////////
    // 7️⃣ RESPONSE
    ///////////////////////////////////////////////////////////

    res.json({ translations });

  } catch (error) {
    console.error(
      "Translate API error:",
      error?.response?.data || error.message
    );

    res.json({
      translations: req.body.text || []
    });
  }
});


fs.writeFileSync(
  "./translationCache.json",
  JSON.stringify(translationCache)
);

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB error ❌', err));

/* =======================
   SOCKET.IO
======================= */
let activeRooms = new Set();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /** ==========================
   * Chat logic
   * ========================== */

  // Client or Admin joins a room
  socket.on("join_room", ({ room, isAdmin }) => {
    socket.join(room);
    console.log(`${isAdmin ? "Admin" : "Client"} joined room: ${room}`);

    if (!isAdmin) {
      activeRooms.add(room);
      io.emit("update_rooms", Array.from(activeRooms));
    }
  });

  // Admin dashboard joins
  socket.on("admin_join", () => {
    socket.emit("update_rooms", Array.from(activeRooms));
  });

  // Send chat messages
  socket.on("chat_message", (msg) => {
    const { room, isAdmin } = msg;

    // Broadcast to everyone in the room
    io.to(room).emit("chat_message", msg);

    // Notify admin dashboard if message is from a client
    if (!isAdmin) {
      io.emit("chat_message", msg);
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    // Clean up empty rooms
    activeRooms.forEach((room) => {
      const roomSockets = io.sockets.adapter.rooms.get(room);
      if (!roomSockets || roomSockets.size === 0) {
        activeRooms.delete(room);
      }
    });

    // Update admin dashboards
    io.emit("update_rooms", Array.from(activeRooms));
  });

  /** ==========================
   * Shipment tracking logic (unchanged)
   * ========================== */
  socket.on("location_update", async (payload) => {
    const Shipment = require("./models/Shipment");
    try {
      const s = await Shipment.findOneAndUpdate(
        { trackingCode: payload.trackingCode },
        {
          location: { coords: payload.coords, updatedAt: new Date() },
          $push: {
            history: {
              status: payload.status || "in_transit",
              location: payload.coords,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
      io.to(`tracking_${payload.trackingCode}`).emit("location_update", s);
    } catch (err) {
      console.error("Error updating shipment location:", err);
    }
  });
});



/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
);


const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const http = require('http');
const cors = require("cors");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
// Static folders for invoices and uploads
app.use('/invoices', express.static(path.join(__dirname, process.env.INVOICES_DIR || 'invoice')));
app.use('/upload', express.static(path.join(__dirname, process.env.UPLOADS_DIR || 'upload')));

app.get('/', (req, res) => {
  res.send('Hello! Your server is running ✅');
});
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('Mongo error ❌', err));



// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipment', require('./routes/shipment'));
app.use('/api/track', require('./routes/tracking'));
app.use('/api/invoice', require('./routes/invoice'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/email', require('./routes/email'));


// Socket.IO for chat + tracking
io.on('connection', socket => {
console.log('socket connected', socket.id);


socket.on('join_room', ({ room }) => {
socket.join(room);
});


socket.on('chat_message', async (msg) => {
// msg: { room, shipmentId, senderId, senderName, text }
const Chat = require('./models/Chat');
const message = await Chat.create({ chatId: msg.room, senderId: msg.senderId, senderName: msg.senderName, text: msg.text });
io.to(msg.room).emit('chat_message', message);
});


socket.on('location_update', async (payload) => {
// payload: { trackingCode, coords }
const Shipment = require('./models/Shipment');
const s = await Shipment.findOneAndUpdate({ trackingCode: payload.trackingCode }, {
location: { coords: payload.coords, updatedAt: new Date() },
$push: { history: { status: payload.status || 'in_transit', location: payload.coords, timestamp: new Date() } }
}, { new: true });
io.to(`tracking_${payload.trackingCode}`).emit('location_update', s);
});
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/animals', require('./routes/animals'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/promos', require('./routes/promos'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/chat', require('./routes/chat'));

// Socket.io
require('./sockets/chat')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🌿 FarmTrust server running on port ${PORT}`));

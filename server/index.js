const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');

dotenv.config();
const app = express();
const server = http.createServer(app);

// ─── CORS — manual headers on EVERY request ─────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// ─── Body parsers ────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health check ────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'FarmTrust API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/animals',       require('./routes/animals'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/cart',          require('./routes/cart'));
app.use('/api/comments',      require('./routes/comments'));
app.use('/api/messages',      require('./routes/messages'));
app.use('/api/promotions',    require('./routes/promotions'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/logs',          require('./routes/logs'));
app.use('/api/stats',         require('./routes/stats'));
app.use('/api/video',         require('./routes/video'));

// ─── Socket.io ───────────────────────────────────────────
try {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['polling', 'websocket'],
  });
  require('./utils/socket')(io);
} catch (e) {
  console.log('Socket.io not available:', e.message);
}

// ─── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message });
});

// ─── MongoDB ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ─── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ─── Handle uncaught errors ───────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err?.message || err);
});

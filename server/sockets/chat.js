const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
      const msg = await Message.create({ senderId, receiverId, message });
      io.to(receiverId).emit('receiveMessage', msg);
      io.to(senderId).emit('receiveMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};

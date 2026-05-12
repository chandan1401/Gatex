const socketIO = require('socket.io');
const logger = require('../utils/logger');
const { authenticate } = require('../middleware/auth');

let io;

const startSocketServer = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const jwt = require('../utils/jwt');
      const decoded = jwt.verifyToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info('Client connected:', { userId: socket.user.userId, socketId: socket.id });

    // Join user room
    socket.join(`user:${socket.user.userId}`);

    // Handle events
    socket.on('disconnect', () => {
      logger.info('Client disconnected:', { userId: socket.user.userId });
    });

    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });

    // Example: Real-time notifications
    socket.on('subscribe', (data) => {
      const { topic } = data;
      socket.join(`topic:${topic}`);
      logger.debug(`User subscribed to topic: ${topic}`);
    });

    socket.on('unsubscribe', (data) => {
      const { topic } = data;
      socket.leave(`topic:${topic}`);
      logger.debug(`User unsubscribed from topic: ${topic}`);
    });
  });

  logger.info('WebSocket server started');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// Emit to user
const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

// Emit to topic
const emitToTopic = (topic, event, data) => {
  if (!io) return;
  io.to(`topic:${topic}`).emit(event, data);
};

// Broadcast to all
const broadcast = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

module.exports = {
  startSocketServer,
  getIO,
  emitToUser,
  emitToTopic,
  broadcast,
};

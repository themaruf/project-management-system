const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-project', (projectId) => {
      socket.join(`project-${projectId}`);
    });

    socket.on('leave-project', (projectId) => {
      socket.leave(`project-${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

const emitProjectUpdate = (projectId, data) => {
  if (io) {
    io.to(`project-${projectId}`).emit('project-update', data);
  }
};

const emitTaskUpdate = (projectId, data) => {
  if (io) {
    io.to(`project-${projectId}`).emit('task-update', data);
  }
};

module.exports = {
  initializeSocket,
  emitProjectUpdate,
  emitTaskUpdate
};
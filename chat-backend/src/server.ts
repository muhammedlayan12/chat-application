import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connectDB } from './configs/db';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import Message from './models/Message';
import User from './models/User';

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: '*' },
});

// Track online users
const onlineUsers = new Map<string, string>(); // username -> socketId

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: Number(process.env.PORT) || 5000
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Chat Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      users: 'GET /api/auth/users'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO real-time chat
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins - track online status
  socket.on('userOnline', (username: string) => {
    if (username) {
      onlineUsers.set(username, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log(`${username} is now online`);
    }
  });

  socket.on('typing', (data: { from: string; to: string; isTyping: boolean }) => {
    // Emit typing status to the recipient
    io.emit('userTyping', {
      from: data.from,
      to: data.to,
      isTyping: data.isTyping
    });
  });

  socket.on('sendMessage', async (msg) => {
    try {
      const { from, to, text } = msg;

      if (!from || !to || !text) {
        socket.emit('error', { message: 'Invalid message format' });
        return;
      }

      // Stop typing indicator when message is sent
      io.emit('userTyping', {
        from: from,
        to: to,
        isTyping: false
      });

      // Save message to DB
      const message = new Message({ from, to, text });
      await message.save();

      // Emit message to all clients (in production, use rooms to emit only to relevant users)
      io.emit('receiveMessage', {
        from: message.from,
        to: message.to,
        text: message.text,
        createdAt: message.createdAt
      });

      // Emit activity update for admin
      io.emit('chatActivity', {
        from: message.from,
        to: message.to,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    // Remove user from online list
    for (const [username, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(username);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log(`${username} is now offline`);
        break;
      }
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Expose online users list via API
app.get('/api/online-users', (_req, res) => {
  res.json({ onlineUsers: Array.from(onlineUsers.keys()) });
});

// Expose chat activity stats
app.get('/api/stats', async (_req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('from to createdAt');

    res.json({
      totalMessages,
      totalUsers,
      onlineUsers: onlineUsers.size,
      recentActivity: recentMessages
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Start server
const PORT: number = Number(process.env.PORT) || 5000;

// Connect to database and start server
connectDB()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log('\n' + '='.repeat(50));
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.IO ready for connections`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50) + '\n');
    });
  })
  .catch((error) => {
    console.error('\n❌ Failed to start server:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check if MongoDB is running and connection string is correct');
    console.error('2. Check if port', PORT, 'is already in use');
    console.error('3. Verify all dependencies are installed: npm install\n');
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Export io for use in other modules if needed
export { io };

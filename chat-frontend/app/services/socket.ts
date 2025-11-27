import { io, Socket } from 'socket.io-client';

// Backend Socket.IO server URL (should match backend port)
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Connection status logging
socket.on('connect', () => {
  console.log('✅ Socket.IO connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket.IO disconnected');
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket.IO connection error:', error.message);
  console.log('💡 Make sure backend is running on port 5000');
});

// Helper to notify server when user comes online
export const notifyUserOnline = (username: string) => {
  if (username && socket.connected) {
    socket.emit('userOnline', username);
  } else if (username) {
    // Wait for connection if not connected yet
    socket.once('connect', () => {
      socket.emit('userOnline', username);
    });
  }
};

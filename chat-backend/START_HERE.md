# 🚀 Backend Startup Guide

## Port Configuration
- **Backend runs on: PORT 5000** (default)
- **Frontend runs on: PORT 3000** (Next.js default)

## How to Start Backend

### Step 1: Navigate to backend folder
```bash
cd chat-backend
```

### Step 2: Install dependencies (if not done)
```bash
npm install
```

### Step 3: Start the server
```bash
npm run dev
```

## Expected Output

When the server starts successfully, you should see:
```
✅ MongoDB connected successfully
==================================================
🚀 Server running on port 5000
📡 Socket.IO ready for connections
🌐 API available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
==================================================
```

## Troubleshooting

### ❌ "Port 5000 already in use"
**Solution:** Change the port
1. Create `.env` file in `chat-backend` folder
2. Add: `PORT=5001`
3. Update frontend API URL in `chat-frontend/app/services/authAPI.ts`:
   ```typescript
   const API_URL = 'http://localhost:5001/api';
   ```

### ❌ "MongoDB connection error"
**Solution:** Check MongoDB connection
1. Verify MongoDB connection string in `src/configs/db.ts`
2. Make sure MongoDB Atlas cluster is running
3. Check if IP is whitelisted in MongoDB Atlas

### ❌ "Cannot find module"
**Solution:** Install dependencies
```bash
npm install
```

## Test the Server

1. Open browser: http://localhost:5000/api/health
2. Should return: `{"status":"ok","message":"Server is running"}`

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users
- `GET /api/messages?user1=xxx&user2=yyy` - Get messages
- `GET /api/online-users` - Get online users
- `GET /api/stats` - Get statistics


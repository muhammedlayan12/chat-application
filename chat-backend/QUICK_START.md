# 🚀 QUICK START - Fix "Cannot connect to server" Error

## ✅ Step-by-Step Solution

### Step 1: Open a NEW Terminal Window
- Press `Windows Key + R`
- Type `cmd` or `powershell` and press Enter
- OR use VS Code terminal (Terminal → New Terminal)

### Step 2: Navigate to Backend Folder
```bash
cd "C:\Users\muhammad layan\Documents\backend-practice\chat-application\chat-backend"
```

### Step 3: Install Dependencies (if not done)
```bash
npm install
```

### Step 4: Start the Backend Server
```bash
npm run dev
```

### Step 5: Wait for Success Message
You should see:
```
✅ MongoDB connected successfully
==================================================
🚀 Server running on port 5000
📡 Socket.IO ready for connections
🌐 API available at http://localhost:5000/api
💚 Health check: http://localhost:5000/api/health
==================================================
```

### Step 6: Keep This Terminal Open!
**DO NOT CLOSE THIS TERMINAL** - The backend must keep running!

### Step 7: Open Another Terminal for Frontend
- Open a NEW terminal window
- Navigate to frontend:
```bash
cd "C:\Users\muhammad layan\Documents\backend-practice\chat-application\chat-frontend"
```
- Start frontend:
```bash
npm run dev
```

## ✅ Verify Backend is Running

### Test 1: Check in Browser
Open: http://localhost:5000/api/health

Should show:
```json
{"status":"ok","message":"Server is running",...}
```

### Test 2: Check Terminal
Look for: `🚀 Server running on port 5000`

## ❌ Common Issues

### Issue: "Port 5000 already in use"
**Solution:**
1. Find what's using port 5000:
```bash
netstat -ano | findstr :5000
```
2. Kill that process OR change backend port:
   - Create `.env` file in `chat-backend` folder
   - Add: `PORT=5001`
   - Update frontend API URL

### Issue: "MongoDB connection error"
**Solution:**
- Check MongoDB connection string in `src/configs/db.ts`
- Verify MongoDB Atlas is running
- Check IP whitelist in MongoDB Atlas

### Issue: "Cannot find module"
**Solution:**
```bash
cd chat-backend
npm install
```

## 📝 Important Notes

1. **Backend MUST run before frontend**
2. **Keep backend terminal open** while using the app
3. **Backend runs on port 5000**
4. **Frontend runs on port 3000**
5. **Both must run at the same time**

## 🎯 Quick Command Reference

```bash
# Terminal 1 - Backend
cd chat-backend
npm run dev

# Terminal 2 - Frontend (after backend is running)
cd chat-frontend
npm run dev
```


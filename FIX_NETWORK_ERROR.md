# 🔧 FIX: "Cannot connect to server" Error

## ✅ SOLUTION: Start the Backend Server

The error means **the backend is NOT running**. Here's how to fix it:

## 🚀 Method 1: Double-Click Script (Easiest)

1. **Double-click** `START_BOTH.bat` in the root folder
   - This will start BOTH backend and frontend automatically
   - Two windows will open - **keep both open!**

## 🚀 Method 2: Manual Start (Step by Step)

### Step 1: Start Backend

**Option A: Double-click script**
- Go to `chat-backend` folder
- Double-click `START_BACKEND.bat`

**Option B: Use Terminal**
1. Open terminal (PowerShell or CMD)
2. Run these commands:
```bash
cd "C:\Users\muhammad layan\Documents\backend-practice\chat-application\chat-backend"
npm run dev
```

3. **Wait for this message:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

4. **KEEP THIS TERMINAL OPEN!** ⚠️

### Step 2: Start Frontend (in NEW terminal)

1. Open a **NEW terminal window**
2. Run:
```bash
cd "C:\Users\muhammad layan\Documents\backend-practice\chat-application\chat-frontend"
npm run dev
```

3. Wait for: `Local: http://localhost:3000`

## ✅ Verify Backend is Running

### Test 1: Open in Browser
Go to: **http://localhost:5000/api/health**

Should show:
```json
{"status":"ok","message":"Server is running"}
```

### Test 2: Check Terminal
Look for: `🚀 Server running on port 5000`

## ❌ Still Not Working?

### Check 1: Is port 5000 free?
```bash
netstat -ano | findstr :5000
```
If something is using it, you'll see output. Otherwise, it's free.

### Check 2: MongoDB Connection
If you see "MongoDB connection error":
- Check `chat-backend/src/configs/db.ts`
- Verify MongoDB Atlas is running
- Check IP whitelist

### Check 3: Dependencies Installed?
```bash
cd chat-backend
npm install
```

## 📋 Quick Checklist

- [ ] Backend terminal shows: `🚀 Server running on port 5000`
- [ ] Browser test: http://localhost:5000/api/health works
- [ ] Backend terminal is still open (not closed)
- [ ] Frontend is running on port 3000
- [ ] Try registration again

## 🎯 Remember

1. **Backend MUST run first** (port 5000)
2. **Keep backend terminal open** while using app
3. **Frontend runs separately** (port 3000)
4. **Both must run at the same time**

## 💡 Pro Tip

Use the `START_BOTH.bat` script - it starts everything automatically!


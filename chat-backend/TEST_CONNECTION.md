# 🔍 Test MongoDB Connection

## Current .env Configuration

Your .env file has:
```
CONNECTION_URL = mongodb+srv://muhammadlayan00_db_user:3j1ZUD1P558rtc6G@cluster0.19opagn.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0
```

## ✅ The Fix is Applied!

The code now reads `CONNECTION_URL` from your .env file.

## 🚀 Next Steps

1. **Restart the backend:**
   ```bash
   npm run dev
   ```

2. **If still getting authentication error, check:**

   ### A. Verify MongoDB Atlas Credentials
   - Go to: https://cloud.mongodb.com
   - Click: Database Access
   - Find user: `muhammadlayan00_db_user`
   - Click "Edit" → "Edit Password"
   - Reset password if needed
   - Copy the NEW password

   ### B. Update .env File
   - Open: `chat-backend/.env`
   - Update `CONNECTION_URL` with correct password:
   ```env
   CONNECTION_URL=mongodb+srv://muhammadlayan00_db_user:YOUR_NEW_PASSWORD@cluster0.19opagn.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0
   ```

   ### C. Check IP Whitelist
   - Go to: MongoDB Atlas → Network Access
   - Click: "Add IP Address"
   - Add: `0.0.0.0/0` (allows all IPs for development)
   - OR add your current IP address

   ### D. Verify Database User Permissions
   - Go to: Database Access
   - User should have: "Read and write to any database"
   - Or at least: "Read and write" to `chat-app` database

## 🔄 After Updating

1. Save .env file
2. Restart backend: `npm run dev`
3. Should see: `✅ MongoDB connected successfully`

## ❓ Still Not Working?

Try this connection string format (without appName):
```env
CONNECTION_URL=mongodb+srv://muhammadlayan00_db_user:3j1ZUD1P558rtc6G@cluster0.19opagn.mongodb.net/chat-app?retryWrites=true&w=majority
```


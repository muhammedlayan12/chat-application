# 🌐 Port Configuration - Simple Guide

## ✅ PORT ASSIGNMENT

### **Frontend (Next.js) → Port 3000**
- Location: `chat-frontend` folder
- URL: `http://localhost:3000`
- Start with: `npm run dev` (in chat-frontend folder)

### **Backend (Express) → Port 5000**
- Location: `chat-backend` folder  
- URL: `http://localhost:5000`
- Start with: `npm run dev` (in chat-backend folder)

## 🚀 How to Run Both

### Terminal 1 - Backend (Port 5000)
```bash
cd chat-backend
npm run dev
```
**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Terminal 2 - Frontend (Port 3000)
```bash
cd chat-frontend
npm run dev
```
**You should see:**
```
- Local:        http://localhost:3000
```

## 📋 Summary

| Service | Port | URL | Folder |
|---------|------|-----|--------|
| **Frontend** | **3000** | http://localhost:3000 | chat-frontend |
| **Backend** | **5000** | http://localhost:5000 | chat-backend |

## ⚠️ Important

- **Frontend (3000)** talks to **Backend (5000)**
- Backend must be running BEFORE you use the frontend
- Both need to run at the same time!


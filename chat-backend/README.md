# Chat Backend Server

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm run dev
```

The server will start on **port 5000** by default.

## Configuration

### Port
- Default: `5000`
- Can be changed via `PORT` environment variable
- Frontend expects backend on `http://localhost:5000`

### MongoDB
- Connection string is in `src/configs/db.ts`
- Can be overridden with `MONGO_URI` environment variable

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users
- `GET /api/messages` - Get messages between users
- `GET /api/online-users` - Get online users
- `GET /api/stats` - Get system statistics

## Troubleshooting

### Server won't start?
1. Check if port 5000 is already in use
2. Verify MongoDB connection string
3. Check console for error messages

### Port already in use?
Change the port in `src/server.ts` or set `PORT` environment variable:
```bash
PORT=5001 npm run dev
```

Then update frontend API URL in `chat-frontend/app/services/authAPI.ts`

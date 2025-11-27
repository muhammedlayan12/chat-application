@echo off
echo ========================================
echo   Starting Chat Application
echo ========================================
echo.
echo This will start BOTH backend and frontend
echo.
echo Step 1: Starting Backend (Port 5000)...
start "Chat Backend" cmd /k "cd /d %~dp0chat-backend && npm run dev"
echo.
timeout /t 5 /nobreak >nul
echo.
echo Step 2: Starting Frontend (Port 3000)...
start "Chat Frontend" cmd /k "cd /d %~dp0chat-frontend && npm run dev"
echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two windows will open - keep both open!
echo.
pause


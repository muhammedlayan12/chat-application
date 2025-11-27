@echo off
echo ========================================
echo   Starting Chat Backend Server
echo ========================================
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting server...
echo.
echo IMPORTANT: Keep this window open!
echo The server must keep running.
echo.
call npm run dev
pause


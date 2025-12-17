@echo off
title Dashboard MSU - Backend Server
color 0A
echo ============================================
echo    DASHBOARD MSU - BACKEND SERVER
echo    Port: 3000
echo ============================================
echo.

cd /d "%~dp0..\Backend"

echo [INFO] Installing dependencies if needed...
call npm install

echo.
echo [INFO] Starting Backend Server...
echo [INFO] Press Ctrl+C to stop
echo.

call npm run dev

pause

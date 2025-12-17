@echo off
title Dashboard MSU - Frontend Server
color 0B
echo ============================================
echo    DASHBOARD MSU - FRONTEND SERVER
echo    Port: 3001
echo ============================================
echo.

cd /d "%~dp0..\Frontend"

echo [INFO] Installing dependencies if needed...
call npm install

echo.
echo [INFO] Starting Frontend Server...
echo [INFO] Press Ctrl+C to stop
echo.

call npm run dev

pause

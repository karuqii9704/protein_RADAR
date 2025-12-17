@echo off
title Dashboard MSU - Starting Servers...
color 0A

echo ========================================
echo   Dashboard Masjid Syamsul 'Ulum
echo   Starting Backend + Frontend
echo ========================================
echo.

:: Start Backend Server (Port 3000)
echo [1/2] Starting Backend Server on port 3000...
cd /d "%~dp0Backend"
start "Backend - Port 3000" cmd /k "npm run dev"

:: Wait 2 seconds before starting frontend
timeout /t 2 /nobreak >nul

:: Start Frontend Server (Port 3001)
echo [2/2] Starting Frontend Server on port 3001...
cd /d "%~dp0Frontend"
start "Frontend - Port 3001" cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:3001
echo.
echo   Tip: Close this window anytime.
echo        Server windows will stay open.
echo ========================================
echo.
pause

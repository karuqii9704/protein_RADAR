@echo off
title Dashboard MSU - Start All Services
color 0F
echo ============================================
echo    DASHBOARD MSU - START ALL SERVICES
echo ============================================
echo.
echo This will open 3 separate windows:
echo   1. Backend Server  (Port 3000)
echo   2. Frontend Server (Port 3001)  
echo   3. ngrok Tunnels
echo.
echo ============================================
echo.

echo [1/3] Starting Backend Server...
start "Backend" cmd /k "cd /d "%~dp0" && 1_start_backend.bat"
timeout /t 5 /nobreak > nul

echo [2/3] Starting Frontend Server...
start "Frontend" cmd /k "cd /d "%~dp0" && 2_start_frontend.bat"
timeout /t 5 /nobreak > nul

echo [3/3] Starting ngrok Tunnels...
start "ngrok" cmd /k "cd /d "%~dp0" && 3_start_ngrok.bat"

echo.
echo ============================================
echo    ALL SERVICES STARTED!
echo ============================================
echo.
echo [NEXT STEPS]
echo 1. Wait for all servers to start
echo 2. Check ngrok window for public URLs
echo 3. Copy Backend ngrok URL 
echo 4. Update Frontend\.env.local with:
echo    NEXT_PUBLIC_API_URL=https://xxx.ngrok-free.app
echo 5. Share Frontend ngrok URL with friends!
echo.
echo ============================================
pause

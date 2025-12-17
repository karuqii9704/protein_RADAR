@echo off
title Dashboard MSU - ngrok Tunnel
color 0E
echo ============================================
echo    DASHBOARD MSU - NGROK TUNNEL
echo    Exposing Frontend (3001) + Backend (3000)
echo ============================================
echo.

cd /d "%~dp0.."

echo [INFO] Starting ngrok tunnels...
echo [INFO] Share the HTTPS URLs with your friends!
echo.
echo [!] IMPORTANT: After ngrok starts, you need to update
echo     Frontend\.env.local with the Backend ngrok URL
echo.

ngrok start --all --config "%~dp0..\ngrok.yml"

pause

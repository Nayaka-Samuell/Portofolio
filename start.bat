@echo off
title Portfolio Full-Stack Launcher

echo =========================================
echo    PORTFOLIO FULL-STACK LAUNCHER
echo =========================================
echo.

:: --- BACKEND ---
echo [1/2] Checking Backend dependencies (Node.js)...
cd backend
if not exist "node_modules\" (
    echo node_modules not found. Installing Backend dependencies...
    call npm install
) else (
    echo Backend node_modules already exists. Skipping install.
)
cd ..
echo.

:: --- FRONTEND ---
echo [2/2] Checking Frontend dependencies (Next.js)...
cd frontend
if not exist "node_modules\" (
    echo node_modules not found. Installing Frontend dependencies...
    call npm install
) else (
    echo Frontend node_modules already exists. Skipping install.
)
cd ..
echo.

:: --- START SERVERS ---
echo Starting servers in new terminal windows...

:: Start Backend Server
start "Backend Server (API:5000)" cmd /k "cd backend && npm run dev"

:: Start Frontend Server
start "Frontend Server (Web:3000)" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================
echo  ALL SERVERS ARE LAUNCHING!
echo =========================================
echo [Frontend URL]  http://localhost:3000
echo [Backend API]   http://localhost:5000
echo.
echo Dashboard Analytics (Backend): http://localhost:5000/api/analytics
echo vCard Generator (Backend):     http://localhost:5000/api/vcard
echo =========================================
echo.
pause

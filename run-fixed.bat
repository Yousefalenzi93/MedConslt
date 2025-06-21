@echo off
title Medical Consultation Platform - Fixed Version

echo.
echo ========================================
echo    Medical Consultation Platform
echo    Fixed Version with Error Components
echo ========================================
echo.

echo [INFO] All error components have been added:
echo   - error.tsx (main app error)
echo   - loading.tsx (main app loading)
echo   - not-found.tsx (404 page)
echo   - global-error.tsx (global error handler)
echo   - ErrorBoundary.tsx (custom error boundary)
echo   - Page-specific error and loading components
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo.
echo [2/4] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)
echo [OK] npm is installed

echo.
echo [3/4] Checking project directory...
if not exist "package.json" (
    echo [ERROR] package.json not found! Make sure you're in the project directory.
    pause
    exit /b 1
)
echo [OK] Project directory confirmed

echo.
echo [4/4] Starting the development server...
echo.
echo [INFO] Starting Medical Consultation Platform...
echo [INFO] Browser will open automatically at: http://localhost:3000
echo.
echo [DEMO ACCOUNTS]
echo   Doctor:  doctor@example.com  / demo123
echo   Admin:   admin@example.com   / admin123
echo   Patient: patient1@example.com / patient123
echo.
echo [INFO] All error handling components are now in place
echo [INFO] The platform should load without "missing error components" issues
echo.
echo Please wait while the server starts...

timeout /t 3 /nobreak >nul

start "" "http://localhost:3000"

echo.
echo [STARTING] Development server is starting...
npm run dev

echo.
echo [STOPPED] Development server stopped
pause

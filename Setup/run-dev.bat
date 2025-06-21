@echo off
echo Starting Medical Consultation Platform...
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Starting development server...
npm run dev

pause

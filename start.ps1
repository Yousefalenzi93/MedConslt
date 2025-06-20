Write-Host "Starting Medical Consultation Platform..." -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed!" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "Please wait while the server starts up..." -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev

Write-Host ""
Write-Host "Server stopped." -ForegroundColor Yellow

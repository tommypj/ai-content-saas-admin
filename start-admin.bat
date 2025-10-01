@echo off
echo 🚀 Starting A-Stats Admin Dashboard Development Environment
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from ai-content-saas-admin directory
    pause
    exit /b 1
)

REM Check if backend is running
echo 🔍 Checking if backend is running on port 5000...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ⚠️  Backend not detected on port 5000
    echo    Please start the backend first:
    echo    cd ..\ai-content-saas-backend ^&^& npm run dev
    echo.
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🎯 Environment Configuration:
type .env | findstr VITE_API_BASE_URL
echo    Admin Port: 3001 (default Vite)
echo.

echo 🌟 Admin Dashboard Features:
echo    • System Analytics ^& Stats (including diskUsage)
echo    • User Management
echo    • Content Monitoring
echo    • Job Queue Status
echo    • Real-time Performance Metrics
echo.

echo 🔑 Test Credentials:
echo    Email: admin@test.com
echo    Password: password123
echo    (Or any user from the customer app)
echo.

echo 📍 Useful URLs:
echo    Admin Login: http://localhost:3001/login
echo    Admin Debug: http://localhost:3001/debug
echo    Admin Dashboard: http://localhost:3001/dashboard
echo.

echo 🚀 Starting admin dashboard...
npm run dev

pause

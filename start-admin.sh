#!/bin/bash

# Admin Dashboard Startup Script
echo "🚀 Starting A-Stats Admin Dashboard Development Environment"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from ai-content-saas-admin directory"
    exit 1
fi

# Check if backend is running
echo "🔍 Checking if backend is running on port 5000..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend not detected on port 5000"
    echo "   Please start the backend first:"
    echo "   cd ../ai-content-saas-backend && npm run dev"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🎯 Environment Configuration:"
echo "   API Base URL: $(grep VITE_API_BASE_URL .env | cut -d '=' -f2)"
echo "   Admin Port: 3001 (default Vite)"
echo ""

echo "🌟 Admin Dashboard Features:"
echo "   • System Analytics & Stats (including diskUsage)"
echo "   • User Management"
echo "   • Content Monitoring" 
echo "   • Job Queue Status"
echo "   • Real-time Performance Metrics"
echo ""

echo "🔑 Test Credentials:"
echo "   Email: admin@test.com"
echo "   Password: password123"
echo "   (Or any user from the customer app)"
echo ""

echo "📍 Useful URLs:"
echo "   Admin Login: http://localhost:3001/login"
echo "   Admin Debug: http://localhost:3001/debug" 
echo "   Admin Dashboard: http://localhost:3001/dashboard"
echo ""

echo "🚀 Starting admin dashboard..."
npm run dev


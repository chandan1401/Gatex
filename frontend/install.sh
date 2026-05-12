#!/bin/bash
# GateX Dashboard Frontend - Installation Script

echo "🚀 GateX Dashboard Frontend - Installation Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm with Node.js"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎉 Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Login with:"
echo "   Email: admin@gatex.com"
echo "   Password: password"
echo ""
echo "📚 For more information, see SETUP.md or README.md"

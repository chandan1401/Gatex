@echo off
REM GateX Dashboard Frontend - Installation Script (Windows)

echo.
echo 🚀 GateX Dashboard Frontend - Installation Script
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm with Node.js
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Dependency installation failed
    exit /b 1
)

echo.
echo ✅ Installation complete!
echo.
echo 🎉 Next steps:
echo 1. Start dev server: npm run dev
echo 2. Open http://localhost:5173 in your browser
echo 3. Login with:
echo    Email: admin@gatex.com
echo    Password: password
echo.
echo 📚 For more information, see SETUP.md or README.md

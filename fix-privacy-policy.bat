@echo off
echo 🔧 Fixing Privacy Policy Page for GitHub Pages...

echo 📦 Building the project...
call pnpm build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 🚀 Deploying to GitHub Pages...
call deploy-to-github.bat

echo ✅ Privacy policy page should now be accessible!
echo 🔗 Test URL: https://patypatii.github.io/Heroes-web/privacy
pause

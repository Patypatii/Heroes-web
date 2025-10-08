@echo off
echo ========================================
echo 🚀 Deploying to GitHub Pages
echo    Domain: heroesmf.it.com
echo ========================================
echo.

REM Navigate to web directory
cd /d "%~dp0"

echo 📦 Step 1: Building with custom domain...
set GITHUB_PAGES_CUSTOM_DOMAIN=true
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 📋 Step 2: Preparing deployment files...

REM Copy configuration files to dist
copy /Y "CNAME" "dist\spa\CNAME"
copy /Y "public\.htaccess" "dist\spa\.htaccess" 2>nul
copy /Y "public\_headers" "dist\spa\_headers" 2>nul
copy /Y "public\vercel.json" "dist\spa\vercel.json" 2>nul

echo.
echo 📊 Step 3: Verifying build...
dir "dist\spa" /b

echo.
if exist "dist\spa\Heroes MF.apk" (
    echo ✅ APK file found in build
) else (
    echo ❌ WARNING: APK file missing!
)

echo.
echo 📤 Step 4: Deploying to GitHub Pages...
echo.

REM Check if gh-pages branch exists
git show-ref --verify --quiet refs/heads/gh-pages
if %errorlevel% equ 0 (
    echo Branch gh-pages exists
) else (
    echo Creating gh-pages branch...
    git checkout --orphan gh-pages
    git rm -rf .
    git checkout main
)

REM Install gh-pages if not installed
echo Installing gh-pages deployment tool...
call npm install --save-dev gh-pages

REM Deploy to gh-pages branch
echo.
echo Deploying to gh-pages branch...
npx gh-pages -d dist/spa -t true

if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Deployment Complete!
echo ========================================
echo.
echo 🌐 Your site will be available at:
echo    https://heroesmf.it.com
echo.
echo ⏱️  Wait 2-5 minutes for GitHub to process the deployment
echo.
echo 📝 Next Steps:
echo 1. Visit https://github.com/Patypatii/Heroes-web/settings/pages
echo 2. Verify source is set to: gh-pages branch
echo 3. Verify custom domain is: heroesmf.it.com
echo 4. Wait for DNS check to complete
echo.
pause


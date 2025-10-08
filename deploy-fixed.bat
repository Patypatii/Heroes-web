@echo off
echo ========================================
echo 🚀 Heroes MF - Complete Deployment
echo ========================================
echo.

REM Navigate to web directory
cd /d "%~dp0"

echo 📦 Step 1: Building application...
set GITHUB_PAGES_CUSTOM_DOMAIN=true
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build complete!
echo.

echo 📋 Step 2: Verifying build output...
if not exist "dist\spa\index.html" (
    echo ❌ Build output not found!
    pause
    exit /b 1
)

echo ✅ Build output verified
echo.

echo 📄 Step 3: Copying configuration files...
copy /Y "CNAME" "dist\spa\CNAME"
copy /Y "public\vercel.json" "dist\spa\vercel.json"
copy /Y "public\_headers" "dist\spa\_headers"
copy /Y "public\.nojekyll" "dist\spa\.nojekyll"
copy /Y "public\404.html" "dist\spa\404.html"

echo ✅ Configuration files copied
echo.

echo 📊 Step 4: Build summary...
echo.
dir "dist\spa" /b
echo.

echo 📁 APK File Status:
if exist "dist\spa\Heroes MF.apk" (
    echo ✅ APK file present in build
    for %%A in ("dist\spa\Heroes MF.apk") do echo    Size: %%~zA bytes
) else (
    echo ❌ WARNING: APK file not found in build!
)
echo.

echo ========================================
echo 🎯 DEPLOYMENT OPTIONS
echo ========================================
echo.
echo Choose your deployment method:
echo.
echo 1. GitHub Pages (Automated)
echo    - Push to main branch
echo    - Wait for GitHub Actions
echo.
echo 2. Manual Upload (Any hosting)
echo    - Upload all files from dist/spa/
echo    - Configure domain DNS
echo.
echo 3. Vercel/Netlify (Drag & Drop)
echo    - Drag dist/spa folder to platform
echo    - Set custom domain
echo.

echo ========================================
echo 📝 NEXT STEPS
echo ========================================
echo.
echo For GitHub Pages:
echo   git add .
echo   git commit -m "Deploy with APK download feature"
echo   git push origin main
echo.
echo For Manual Hosting:
echo   1. Upload contents of 'dist/spa' folder
echo   2. Configure these MIME types:
echo      - .js files → application/javascript
echo      - .css files → text/css
echo      - .webmanifest → application/manifest+json
echo      - .apk → application/vnd.android.package-archive
echo.
echo ========================================
echo.
pause


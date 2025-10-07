@echo off
echo ========================================
echo   DEPLOY TO GITHUB PAGES SUBDIRECTORY
echo   patypatii.github.io/Heroes-web/
echo ========================================
echo.

REM Step 1: Clean previous build
echo [1/4] Cleaning previous build...
if exist "dist\spa" (
    rmdir /s /q "dist\spa"
)

REM Step 2: Build WITHOUT custom domain (uses /Heroes-web/ base path)
echo [2/4] Building for GitHub Pages subdirectory...
set GITHUB_PAGES_CUSTOM_DOMAIN=
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed!
    pause
    exit /b 1
)

REM Step 3: Remove CNAME file (we don't want custom domain)
echo [3/4] Removing CNAME file (no custom domain)...
if exist "dist\spa\CNAME" (
    del "dist\spa\CNAME"
    echo ✅ CNAME file removed
)

REM Step 4: Copy required files
echo [4/4] Copying required files...
copy "public\404.html" "dist\spa\" >nul 2>&1
copy "public\.nojekyll" "dist\spa\" >nul 2>&1

echo.
echo ========================================
echo   DEPLOYING TO GITHUB PAGES...
echo ========================================
echo.

REM Clean cache and deploy
call npx gh-pages-clean
call npx gh-pages -d dist/spa -t -f

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo ✅ Your site has been deployed to GitHub Pages
echo.
echo 🌐 URL: https://patypatii.github.io/Heroes-web/
echo.
echo ⏰ Wait 2-5 minutes for GitHub to process the deployment
echo.
echo 📋 Next steps:
echo    1. Go to: https://github.com/Patypatii/Heroes-web/settings/pages
echo    2. Remove the custom domain (clear the field)
echo    3. Click Save
echo    4. Wait 2 minutes
echo    5. Visit: https://patypatii.github.io/Heroes-web/
echo.
echo 🔗 Test URLs:
echo    - Homepage: https://patypatii.github.io/Heroes-web/
echo    - Privacy:  https://patypatii.github.io/Heroes-web/privacy
echo    - Terms:    https://patypatii.github.io/Heroes-web/terms
echo.
pause


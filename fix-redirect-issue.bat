@echo off
echo ========================================
echo   FIX REDIRECT ISSUE FOR CUSTOM DOMAIN
echo ========================================
echo.
echo This will rebuild your site with the correct configuration for heroesmf.it.com
echo.

REM Step 1: Clean previous build
echo [1/4] Cleaning previous build...
if exist "dist\spa" (
    rmdir /s /q "dist\spa"
)

REM Step 2: Build with custom domain configuration
echo [2/4] Building for custom domain (base path: /)...
set GITHUB_PAGES_CUSTOM_DOMAIN=true
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

REM Step 3: Verify CNAME file exists
echo [3/4] Verifying CNAME file...
if not exist "CNAME" (
    echo heroesmf.it.com > CNAME
    echo ✅ Created CNAME file
) else (
    echo ✅ CNAME file exists
)

REM Step 4: Copy required files to dist
echo [4/4] Copying required files...
copy "public\404.html" "dist\spa\" >nul 2>&1
copy "public\.nojekyll" "dist\spa\" >nul 2>&1
copy "CNAME" "dist\spa\" >nul 2>&1

echo.
echo ========================================
echo   BUILD COMPLETE!
echo ========================================
echo.
echo ✅ Your site is built with the correct configuration for custom domain
echo.
echo 📋 Next steps to deploy:
echo.
echo   1. Copy all files from 'dist\spa' to your GitHub repository root
echo   2. Push to GitHub: git push origin main
echo   3. Go to GitHub Settings → Pages
echo   4. Verify custom domain is set to: heroesmf.it.com
echo   5. Enable "Enforce HTTPS"
echo   6. Wait 2-5 minutes for deployment
echo   7. Clear browser cache and cookies
echo   8. Visit: https://heroesmf.it.com
echo.
echo 📖 For detailed instructions, see CUSTOM_DOMAIN_FIX.md
echo.
pause

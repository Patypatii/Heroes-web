@echo off
echo ========================================
echo   DEPLOYING TO heroesmf.it.com
echo ========================================
echo.
echo This will deploy your site to GitHub Pages with the custom domain configuration
echo.

REM Check if dist/spa exists
if not exist "dist\spa" (
    echo ❌ Error: dist\spa not found. Running build first...
    set GITHUB_PAGES_CUSTOM_DOMAIN=true
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Build failed!
        pause
        exit /b 1
    )
)

echo 📦 Deploying to GitHub Pages...
echo.

REM Clean gh-pages cache first
echo 🧹 Cleaning gh-pages cache...
call npx gh-pages-clean

REM Deploy using gh-pages with force push to overwrite everything
echo 🚀 Force pushing new build...
call npx gh-pages -d dist/spa -t -f

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo Possible issues:
    echo 1. Not authenticated with GitHub
    echo 2. Repository not found
    echo 3. Network issues
    echo.
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
echo 🌐 Custom Domain: https://heroesmf.it.com
echo.
echo ⏰ Wait 2-5 minutes for GitHub to process the deployment
echo.
echo 🧹 Clear your browser cache:
echo    - Press Ctrl+Shift+Delete
echo    - Select "All time"
echo    - Clear "Cached images and files"
echo    - Or use Incognito/Private mode
echo.
echo 📋 Next: Go to GitHub Settings → Pages and verify:
echo    ✓ Custom domain is set to: heroesmf.it.com
echo    ✓ DNS check shows green checkmark
echo    ✓ "Enforce HTTPS" is enabled
echo.
pause


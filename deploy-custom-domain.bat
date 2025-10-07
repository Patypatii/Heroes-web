@echo off
echo 🚀 Deploying to Custom Domain (heroesmf.it.com)...

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Error: Not a git repository. Please initialize git first.
    pause
    exit /b 1
)

echo 📦 Building for custom domain...
set GITHUB_PAGES_CUSTOM_DOMAIN=true
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 📋 Preparing deployment files...

REM Copy all files from dist/spa to root
xcopy /E /Y "dist\spa\*" "."

REM Copy GitHub Pages specific files
copy "public\404.html" "."
copy "public\.nojekyll" "."

REM Ensure CNAME file is in root
copy "CNAME" "."

echo 📝 Verifying CNAME file...
type CNAME

REM Add all files to git
git add .

REM Commit the changes
git commit -m "Deploy to Custom Domain - %date% %time%"

echo ✅ Files prepared for deployment!
echo.
echo 📋 Next steps:
echo 1. Push to your GitHub repository: git push origin main
echo 2. Wait a few minutes for GitHub Pages to rebuild
echo 3. Your site will be available at: https://heroesmf.it.com
echo.
echo 🔗 GitHub Repository: https://github.com/patypatii/Heroes-web
echo 🔗 Custom Domain: https://heroesmf.it.com
echo.
echo ⚠️  IMPORTANT: Make sure your DNS settings are correct:
echo    - A records pointing to GitHub Pages IPs or
echo    - CNAME record pointing to patypatii.github.io
echo.
pause

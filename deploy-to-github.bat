@echo off
echo 🚀 Deploying to GitHub Pages...

REM Check if dist/spa exists
if not exist "dist\spa" (
    echo ❌ Error: dist\spa directory not found. Please run 'pnpm build' first.
    pause
    exit /b 1
)

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Error: Not a git repository. Please initialize git first.
    pause
    exit /b 1
)

echo 📦 Preparing deployment files...

REM Copy all files from dist/spa to root
xcopy /E /Y "dist\spa\*" "."

REM Add all files to git
git add .

REM Commit the changes
git commit -m "Deploy to GitHub Pages - %date% %time%"

echo ✅ Files prepared for deployment!
echo.
echo 📋 Next steps:
echo 1. Push to your GitHub repository: git push origin main
echo 2. Go to your GitHub repository settings
echo 3. Navigate to 'Pages' section
echo 4. Set source to 'Deploy from a branch'
echo 5. Select 'main' branch and '/ (root)' folder
echo 6. Your site will be available at: https://patypatii.github.io/
echo.
echo 🔗 Repository URL: https://github.com/patypatii/your-repo-name
pause


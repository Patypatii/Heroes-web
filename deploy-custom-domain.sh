#!/bin/bash

echo "🚀 Deploying to Custom Domain (heroesmf.it.com)..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Please initialize git first."
    exit 1
fi

echo "📦 Building for custom domain..."
export GITHUB_PAGES_CUSTOM_DOMAIN=true
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📋 Preparing deployment files..."

# Copy all files from dist/spa to root
cp -r dist/spa/* .

# Copy GitHub Pages specific files
cp public/404.html .
cp public/.nojekyll .

# Ensure CNAME file is in root
cp CNAME .

echo "📝 Verifying CNAME file..."
cat CNAME

# Add all files to git
git add .

# Commit the changes
git commit -m "Deploy to Custom Domain - $(date)"

echo "✅ Files prepared for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push to your GitHub repository: git push origin main"
echo "2. Wait a few minutes for GitHub Pages to rebuild"
echo "3. Your site will be available at: https://heroesmf.it.com"
echo ""
echo "🔗 GitHub Repository: https://github.com/patypatii/Heroes-web"
echo "🔗 Custom Domain: https://heroesmf.it.com"
echo ""
echo "⚠️  IMPORTANT: Make sure your DNS settings are correct:"
echo "   - A records pointing to GitHub Pages IPs or"
echo "   - CNAME record pointing to patypatii.github.io"
echo ""

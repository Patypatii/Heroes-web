#!/bin/bash

# Deploy to GitHub Pages
# This script copies the built files to a GitHub Pages repository

echo "🚀 Deploying to GitHub Pages..."

# Check if dist/spa exists
if [ ! -d "dist/spa" ]; then
    echo "❌ Error: dist/spa directory not found. Please run 'pnpm build' first."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository. Please initialize git first."
    exit 1
fi

# Create a new branch for deployment (optional)
echo "📦 Preparing deployment files..."

# Copy all files from dist/spa to root
cp -r dist/spa/* .

# Add all files to git
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages - $(date)"

echo "✅ Files prepared for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push to your GitHub repository: git push origin main"
echo "2. Go to your GitHub repository settings"
echo "3. Navigate to 'Pages' section"
echo "4. Set source to 'Deploy from a branch'"
echo "5. Select 'main' branch and '/ (root)' folder"
echo "6. Your site will be available at: https://patypatii.github.io/"
echo ""
echo "🔗 Repository URL: https://github.com/patypatii/your-repo-name"


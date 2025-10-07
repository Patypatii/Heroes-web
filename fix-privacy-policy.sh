#!/bin/bash

echo "🔧 Fixing Privacy Policy Page for GitHub Pages..."

echo "📦 Building the project..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🚀 Deploying to GitHub Pages..."
./deploy-to-github.sh

echo "✅ Privacy policy page should now be accessible!"
echo "🔗 Test URL: https://patypatii.github.io/Heroes-web/privacy"

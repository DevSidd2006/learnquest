#!/bin/bash

# LearnQuest Vercel Deployment Script
echo "🚀 Starting LearnQuest deployment to Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check TypeScript
echo "Checking TypeScript..."
npm run check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed. Please fix errors before deploying."
    exit 1
fi

# Test build
echo "Testing build..."
npm run build:client
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

# Check if environment variables are documented
if [ ! -f ".env.example" ]; then
    echo "⚠️  Warning: .env.example not found. Make sure to document your environment variables."
fi

# Commit changes if there are any
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "🚀 Pre-deployment commit $(date)"
    git push origin main
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at your Vercel URL"
echo "📋 Don't forget to:"
echo "   - Set environment variables in Vercel dashboard"
echo "   - Run database migration in Supabase"
echo "   - Test all functionality"
#!/bin/bash

# Medical Consultation Platform Setup Script
# This script sets up the development environment for the medical consultation platform

set -e

echo "🏥 Medical Consultation Platform Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if Firebase CLI is installed globally
if ! command -v firebase &> /dev/null; then
    echo ""
    echo "🔥 Firebase CLI not found. Installing globally..."
    npm install -g firebase-tools
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Firebase CLI"
        exit 1
    fi
    
    echo "✅ Firebase CLI installed successfully"
else
    echo "✅ Firebase CLI $(firebase --version) detected"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Please update .env.local with your Firebase configuration"
    echo "   You can get these values from your Firebase project settings"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo ""
echo "📁 Creating necessary directories..."
mkdir -p public/images
mkdir -p public/icons
mkdir -p src/lib/utils
mkdir -p src/hooks
mkdir -p src/constants

echo "✅ Directories created"

# Check TypeScript configuration
echo ""
echo "🔧 Checking TypeScript configuration..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ TypeScript configuration has errors"
    exit 1
fi

echo "✅ TypeScript configuration is valid"

# Run linting
echo ""
echo "🧹 Running linter..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting found some issues, but continuing..."
fi

# Create a simple health check
echo ""
echo "🏥 Creating health check endpoint..."
mkdir -p src/app/api/health
cat > src/app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Medical Consultation Platform'
  });
}
EOF

echo "✅ Health check endpoint created"

# Create a basic manifest.json for PWA
echo ""
echo "📱 Creating PWA manifest..."
cat > public/manifest.json << 'EOF'
{
  "name": "Medical Consultation Platform",
  "short_name": "MedConsult",
  "description": "Comprehensive medical consultation platform for doctors",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#2563eb",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

echo "✅ PWA manifest created"

# Create robots.txt
echo ""
echo "🤖 Creating robots.txt..."
cat > public/robots.txt << 'EOF'
User-agent: *
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/

Allow: /auth/
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
EOF

echo "✅ robots.txt created"

# Create a basic sitemap
echo ""
echo "🗺️  Creating sitemap..."
cat > public/sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/auth/login</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/auth/register</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

echo "✅ Sitemap created"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.local with your Firebase configuration"
echo "2. Set up your Firebase project:"
echo "   - firebase login"
echo "   - firebase init"
echo "   - firebase deploy --only firestore:rules,storage"
echo "3. Run the development server: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "- README.md - Complete setup and usage guide"
echo "- Firebase Console - Manage your database and authentication"
echo "- Tailwind CSS - Styling framework documentation"
echo ""
echo "🆘 Need help?"
echo "- Check the README.md file"
echo "- Review the Firebase documentation"
echo "- Contact the development team"
echo ""
echo "Happy coding! 👨‍⚕️👩‍⚕️"

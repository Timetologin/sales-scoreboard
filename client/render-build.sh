#!/usr/bin/env bash
# Build script for Render

echo "🔨 Starting build process..."

# Install dependencies
npm install

# Build the project
npm run build

# Copy redirect rules to dist folder
echo "📋 Copying redirect rules..."
cp public/_redirects dist/_redirects 2>/dev/null || echo "⚠️  _redirects file not found in public/"
cp public/netlify.toml dist/netlify.toml 2>/dev/null || echo "ℹ️  netlify.toml not needed"

# List dist contents to verify
echo "📦 Build complete! Contents of dist folder:"
ls -la dist/

echo "✅ Build finished successfully!"
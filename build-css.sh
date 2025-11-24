#!/bin/bash
# Professional CSS Build Script
# Properly concatenates and minifies CSS with validation

set -e  # Exit on any error

echo "🔨 Building CSS..."
echo ""

# Validate input files exist
if [ ! -f "css/variables.css" ]; then
  echo "❌ ERROR: css/variables.css not found"
  exit 1
fi

if [ ! -f "css/main.css" ]; then
  echo "❌ ERROR: css/main.css not found"
  exit 1
fi

# Backup existing minified file
if [ -f "css/styles.min.css" ]; then
  cp css/styles.min.css css/styles.min.css.backup
  echo "📦 Backed up existing styles.min.css"
fi

# Build and minify CSS properly
echo "📝 Concatenating: variables.css + reset.css + main.css + components.css"
echo "⚙️  Minifying with clean-css-cli..."

cat css/variables.css css/reset.css css/main.css css/components.css | npx clean-css-cli -o css/styles.min.css

# Validate output
if [ ! -f "css/styles.min.css" ]; then
  echo "❌ ERROR: Build failed - styles.min.css not created"
  if [ -f "css/styles.min.css.backup" ]; then
    mv css/styles.min.css.backup css/styles.min.css
    echo "🔄 Restored backup"
  fi
  exit 1
fi

# Check file size
SIZE=$(wc -c < css/styles.min.css | tr -d ' ')
if [ "$SIZE" -lt 10000 ]; then
  echo "❌ ERROR: Output file too small ($SIZE bytes) - build likely failed"
  mv css/styles.min.css.backup css/styles.min.css
  echo "🔄 Restored backup"
  exit 1
fi

# Check it's actually minified (should be 0-1 lines)
LINES=$(wc -l < css/styles.min.css | tr -d ' ')
if [ "$LINES" -gt 5 ]; then
  echo "⚠️  WARNING: Output has $LINES lines - may not be properly minified"
fi

echo ""
echo "✅ CSS built successfully!"
echo "   📊 Size: $(ls -lh css/styles.min.css | awk '{print $5}')"
echo "   📄 Lines: $LINES (minified files should be 0-1 lines)"
echo "   💾 Backup: css/styles.min.css.backup"
echo ""
echo "🔍 First 200 characters:"
head -c 200 css/styles.min.css
echo ""
echo ""

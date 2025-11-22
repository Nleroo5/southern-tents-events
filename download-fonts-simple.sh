#!/bin/bash

# Professional font download script using google-webfonts-helper
# Downloads optimized fonts with Latin subset only

mkdir -p fonts-optimized

echo "🚀 Downloading Optimized Fonts..."
echo "════════════════════════════════════════════════════════════"

# Download Inter (Variable)
echo "⬇️  Downloading Inter..."
curl -sL "https://gwfh.mranftl.com/api/fonts/inter?download=zip&subsets=latin&variants=300,regular,500,600,700" -o fonts-optimized/inter.zip
cd fonts-optimized && unzip -q inter.zip && rm inter.zip && cd ..
echo "✅ Inter downloaded"

# Download Cormorant Garamond
echo "⬇️  Downloading Cormorant Garamond..."
curl -sL "https://gwfh.mranftl.com/api/fonts/cormorant-garamond?download=zip&subsets=latin&variants=300,regular,600,700" -o fonts-optimized/cormorant.zip
cd fonts-optimized && unzip -q cormorant.zip && rm cormorant.zip && cd ..
echo "✅ Cormorant Garamond downloaded"

# Download Pinyon Script
echo "⬇️  Downloading Pinyon Script..."
curl -sL "https://gwfh.mranftl.com/api/fonts/pinyon-script?download=zip&subsets=latin&variants=regular" -o fonts-optimized/pinyon.zip
cd fonts-optimized && unzip -q pinyon.zip && rm pinyon.zip && cd ..
echo "✅ Pinyon Script downloaded"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✨ FONTS DOWNLOADED"
echo ""
du -sh fonts-optimized
echo ""

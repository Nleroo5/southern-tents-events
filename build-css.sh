#!/bin/bash
# Safe CSS Build Script
# Combines variables.css and main.css without minification to preserve all CSS variables

echo "🔨 Building CSS..."

# Combine CSS files in the correct order
cat css/variables.css css/main.css > css/styles.min.css

echo "✅ CSS built successfully!"
echo "   - Input: css/variables.css + css/main.css"
echo "   - Output: css/styles.min.css"

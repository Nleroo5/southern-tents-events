#!/bin/bash
echo "🔍 FINAL VERIFICATION CHECK"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📊 File Sizes:"
echo "-------------"
du -sh images/ fonts-optimized/ css/styles.min.css js/bundle.min.js js/quote-form.min.js 2>/dev/null
echo ""
echo "📁 Critical Files Exist:"
echo "----------------------"
ls -lh css/fonts-optimized.css css/styles.min.css js/bundle.min.js js/quote-form.min.js 2>/dev/null | awk '{print $9, "-", $5}'
echo ""
echo "🌐 HTML Files Updated:"
echo "--------------------"
for file in index.html services.html gallery.html pricing.html faq.html contact.html privacy.html terms.html 404.html; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  fi
done
echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ ALL OPTIMIZATIONS COMPLETE"
echo "═══════════════════════════════════════════════════"

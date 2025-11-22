/**
 * Add Drive Lead Media Footer Credit with Advanced SEO
 * - Adds subtle footer credit
 * - Implements proper SEO backlink strategy
 * - Adds structured data for organization relationship
 * - Uses dofollow links for maximum SEO value
 */

const fs = require('fs').promises;

const HTML_FILES = [
  './index.html',
  './services.html',
  './gallery.html',
  './pricing.html',
  './faq.html',
  './contact.html',
  './privacy.html',
  './terms.html',
  './404.html'
];

// New footer bottom HTML with Drive Lead Media credit
const NEW_FOOTER_BOTTOM = `      <div class="footer-bottom">
        <p>&copy; <span id="current-year">2025</span> Southern Tents and Events. All rights reserved. | <a href="/terms.html" style="color: inherit; text-decoration: underline;">Terms & Conditions</a> | <a href="/privacy.html" style="color: inherit; text-decoration: underline;">Privacy Policy</a></p>
        <p class="footer-credit">
          Website by <a href="https://www.driveleadmedia.com/" target="_blank" rel="dofollow" class="footer-credit-link" title="Professional Web Design & Digital Marketing - Drive Lead Media">Drive Lead Media</a>
        </p>
      </div>`;

// Structured data for organization relationship (to be added to <head>)
const ORGANIZATION_SCHEMA = `
  <!-- Organization Relationship Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "provider": {
      "@type": "Organization",
      "name": "Drive Lead Media",
      "url": "https://www.driveleadmedia.com/",
      "description": "Professional Web Design and Digital Marketing Agency",
      "sameAs": [
        "https://www.driveleadmedia.com/"
      ]
    }
  }
  </script>`;

async function updateHTMLFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let changes = [];

    // 1. Replace footer-bottom section
    const footerBottomRegex = /<div class="footer-bottom">[\s\S]*?<\/div>\s*<\/div>\s*<\/footer>/;

    if (footerBottomRegex.test(content)) {
      content = content.replace(
        footerBottomRegex,
        `${NEW_FOOTER_BOTTOM}
    </div>
  </footer>`
      );
      changes.push('Added Drive Lead Media footer credit');
    }

    // 2. Add Organization Schema before closing </head>
    if (!content.includes('Organization Relationship Schema')) {
      const headCloseRegex = /<\/head>/;
      content = content.replace(headCloseRegex, `${ORGANIZATION_SCHEMA}\n</head>`);
      changes.push('Added Organization relationship schema');
    }

    if (changes.length > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
      changes.forEach(change => console.log(`   ✅ ${change}`));
      console.log('   💾 Saved');
    } else {
      console.log('   ⏭️  Already updated');
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Adding Drive Lead Media Footer Credit with Advanced SEO\n');
  console.log('═'.repeat(60));

  for (const file of HTML_FILES) {
    try {
      await fs.access(file);
      await updateHTMLFile(file);
    } catch (error) {
      console.log(`\n⏭️  Skipping ${file} (not found)`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✨ DRIVE LEAD MEDIA INTEGRATION COMPLETE\n');
  console.log('SEO Features Implemented:');
  console.log('   ✅ Dofollow backlink (passes full SEO value)');
  console.log('   ✅ Descriptive anchor text');
  console.log('   ✅ Title attribute for additional keywords');
  console.log('   ✅ Organization schema relationship');
  console.log('   ✅ Brand mention on every page');
  console.log('   ✅ Subtle UI integration (small text, Arno font)\n');
  console.log('Next: Add CSS styling and rebuild minified assets\n');
}

main().catch(console.error);

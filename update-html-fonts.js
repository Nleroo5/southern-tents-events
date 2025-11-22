/**
 * Update HTML files to use optimized self-hosted fonts
 * - Replaces Google Fonts with local fonts
 * - Adds preload tags for critical fonts
 * - Removes Google Fonts preconnect
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

const GOOGLE_FONTS_LINK_REGEX = /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*"\s+rel="stylesheet">/gi;
const PRECONNECT_GOOGLE_REGEX = /<link\s+rel="preconnect"\s+href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>/gi;

const OPTIMIZED_FONT_LINK = `  <!-- Optimized Self-Hosted Fonts -->
  <link rel="stylesheet" href="/css/fonts-optimized.css">

  <!-- Preload Critical Fonts -->
  <link rel="preload" href="/fonts-optimized/inter-v20-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts-optimized/cormorant-garamond-v21-latin-regular.woff2" as="font" type="font/woff2" crossorigin>`;

async function updateHTMLFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Remove Google Fonts preconnect
    if (PRECONNECT_GOOGLE_REGEX.test(content)) {
      content = content.replace(PRECONNECT_GOOGLE_REGEX, '');
      console.log('   ✅ Removed Google Fonts preconnect tags');
      modified = true;
    }

    // Replace Google Fonts link with optimized fonts
    if (GOOGLE_FONTS_LINK_REGEX.test(content)) {
      content = content.replace(GOOGLE_FONTS_LINK_REGEX, OPTIMIZED_FONT_LINK);
      console.log('   ✅ Replaced Google Fonts with self-hosted fonts');
      modified = true;
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log('   💾 Saved changes');
    } else {
      console.log('   ⏭️  No changes needed');
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Updating HTML Files with Optimized Fonts\n');
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
  console.log('✨ FONT UPDATE COMPLETE\n');
  console.log('Benefits:');
  console.log('   • No external DNS lookups (faster)');
  console.log('   • Latin subset only (50-70% smaller)');
  console.log('   • font-display: swap (no invisible text)');
  console.log('   • Preloaded critical fonts (instant rendering)\n');
}

main().catch(console.error);

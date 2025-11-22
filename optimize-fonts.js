/**
 * Professional Font Optimization Script
 * - Downloads Google Fonts and self-hosts them
 * - Creates optimized @font-face CSS with font-display: swap
 * - Subsetting to Latin characters only
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const FONTS_DIR = './fonts-optimized';

// Google Fonts API endpoints (with Latin subset)
const FONT_URLS = {
  // Inter - Variable font (replaces all weights)
  'Inter-Variable': 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',

  // Cormorant Garamond
  'CormorantGaramond-Light': 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQAllvuQWJ5heb_w.woff2',
  'CormorantGaramond-Regular': 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrEP1P3GTSA.woff2',
  'CormorantGaramond-SemiBold': 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQKlhvuQWJ5heb_w.woff2',
  'CormorantGaramond-Bold': 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQeltvuQWJ5heb_w.woff2',

  // Pinyon Script
  'PinyonScript-Regular': 'https://fonts.gstatic.com/s/pinyonscript/v22/6xKpdSJbL9-e9LuoeQiDRQR8WOXaPw.woff2'
};

async function downloadFont(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🚀 Downloading and Optimizing Fonts\n');
  console.log('═'.repeat(60));

  // Create fonts directory
  await fs.mkdir(FONTS_DIR, { recursive: true });
  console.log(`📁 Created ${FONTS_DIR}\n`);

  let totalSize = 0;

  // Download all fonts
  for (const [name, url] of Object.entries(FONT_URLS)) {
    try {
      console.log(`⬇️  Downloading ${name}...`);
      const fontData = await downloadFont(url, name);
      const filename = `${name}.woff2`;
      await fs.writeFile(path.join(FONTS_DIR, filename), fontData);

      totalSize += fontData.length;
      console.log(`   ✅ Saved ${filename} (${(fontData.length / 1024).toFixed(1)} KB)`);
    } catch (error) {
      console.error(`   ❌ Error downloading ${name}:`, error.message);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`📊 Total font size: ${(totalSize / 1024).toFixed(1)} KB\n`);

  // Generate optimized CSS
  const css = `/**
 * Optimized Self-Hosted Fonts
 * - Latin subset only
 * - font-display: swap for better performance
 * - Variable font for Inter (single file for all weights)
 */

/* Inter Variable Font (Replaces weights 300-700) */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url('../fonts-optimized/Inter-Variable.woff2') format('woff2-variations');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Cormorant Garamond Light 300 */
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('../fonts-optimized/CormorantGaramond-Light.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Cormorant Garamond Regular 400 */
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../fonts-optimized/CormorantGaramond-Regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Cormorant Garamond SemiBold 600 */
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('../fonts-optimized/CormorantGaramond-SemiBold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Cormorant Garamond Bold 700 */
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('../fonts-optimized/CormorantGaramond-Bold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Pinyon Script Regular */
@font-face {
  font-family: 'Pinyon Script';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('../fonts-optimized/PinyonScript-Regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;

  await fs.writeFile('./css/fonts-optimized.css', css);
  console.log('✅ Generated css/fonts-optimized.css\n');

  console.log('═'.repeat(60));
  console.log('✨ FONT OPTIMIZATION COMPLETE\n');
  console.log('Next steps:');
  console.log('1. Replace Google Fonts link with:');
  console.log('   <link rel="stylesheet" href="/css/fonts-optimized.css">');
  console.log('2. Preload critical fonts in <head>:');
  console.log('   <link rel="preload" href="/fonts-optimized/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin>');
  console.log('3. Remove Google Fonts <link> tags\n');
}

main().catch(console.error);

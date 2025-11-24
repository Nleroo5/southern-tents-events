/**
 * CHECK WHAT CSS THE BROWSER ACTUALLY LOADS
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function checkBrowserCSS() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-cache']
  });

  const page = await browser.newPage();

  // Disable cache
  await page.setCacheEnabled(false);

  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0'
  });

  // Get the actual CSS content the browser loaded
  const loadedCSS = await page.evaluate(() => {
    const styleSheets = Array.from(document.styleSheets);
    const mainStyleSheet = styleSheets.find(s => s.href && s.href.includes('styles.min.css'));

    if (!mainStyleSheet) return 'NOT FOUND';

    try {
      const rules = Array.from(mainStyleSheet.cssRules || mainStyleSheet.rules);
      const first500Chars = rules.slice(0, 3).map(r => r.cssText).join('\n');
      return first500Chars;
    } catch(e) {
      return 'CANNOT READ: ' + e.message;
    }
  });

  console.log('═'.repeat(80));
  console.log('CSS LOADED BY BROWSER:');
  console.log('═'.repeat(80));
  console.log(loadedCSS);
  console.log('');

  // Now check the actual file on disk
  const fileCSS = fs.readFileSync('/Users/nicolasleroo/Desktop/southern-tents-events/css/styles.min.css', 'utf8');
  console.log('═'.repeat(80));
  console.log('CSS FILE ON DISK (first 500 chars):');
  console.log('═'.repeat(80));
  console.log(fileCSS.substring(0, 500));
  console.log('');

  const fileHasRoot = fileCSS.includes(':root');
  const fileHasVariables = fileCSS.includes('--color-primary');

  console.log('FILE ANALYSIS:');
  console.log(`  Contains :root? ${fileHasRoot ? '✅ YES' : '❌ NO'}`);
  console.log(`  Contains --color-primary? ${fileHasVariables ? '✅ YES' : '❌ NO'}`);

  await browser.close();
}

checkBrowserCSS()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

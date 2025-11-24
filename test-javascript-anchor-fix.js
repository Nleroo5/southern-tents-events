/**
 * TEST JAVASCRIPT ANCHOR SCROLLING FIX
 * Verify anchors now position correctly with JS solution
 */

const puppeteer = require('puppeteer');

async function testJSAnchorFix() {
  console.log('═'.repeat(100));
  console.log('TESTING JAVASCRIPT ANCHOR SCROLLING FIX');
  console.log('═'.repeat(100));
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'Mobile', width: 375, height: 667, expectedHeaderHeight: 161 },
    { name: 'Tablet', width: 600, height: 800, expectedHeaderHeight: 181 },
    { name: 'Desktop', width: 1200, height: 1024, expectedHeaderHeight: 211 }
  ];

  const anchors = ['#tents', '#furniture', '#lighting'];

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });

    console.log('═'.repeat(100));
    console.log(`${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log('═'.repeat(100));
    console.log('');

    for (const anchor of anchors) {
      // Navigate to the anchor
      await page.goto(`http://localhost:3000/services.html${anchor}`, {
        waitUntil: 'networkidle0'
      });

      // Wait for JavaScript to execute and scroll
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await page.evaluate(() => {
        const header = document.querySelector('.header');
        const h2 = document.querySelector('h2');

        const headerRect = header.getBoundingClientRect();
        const h2Rect = h2.getBoundingClientRect();

        const gap = Math.round(h2Rect.top - headerRect.bottom);

        return {
          headerBottom: Math.round(headerRect.bottom),
          h2Top: Math.round(h2Rect.top),
          gap: gap
        };
      });

      const status = result.gap === 0 ? '✅ PERFECT' :
                     result.gap > 0 ? `❌ GAP OF ${result.gap}px` :
                     `❌ OVERLAP OF ${Math.abs(result.gap)}px`;

      console.log(`${anchor}:`);
      console.log(`  Header bottom: ${result.headerBottom}px`);
      console.log(`  H2 top: ${result.h2Top}px`);
      console.log(`  Gap: ${result.gap}px`);
      console.log(`  Status: ${status}`);
      console.log('');
    }
  }

  await browser.close();

  console.log('═'.repeat(100));
  console.log('TEST COMPLETE');
  console.log('═'.repeat(100));
}

testJSAnchorFix()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

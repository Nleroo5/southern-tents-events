/**
 * CORRECT OFFSET CALCULATION
 * Measure where browser scrolls to with current scroll-margin-top,
 * then calculate what offset would place H2 at header bottom
 */

const puppeteer = require('puppeteer');

async function measureCorrectOffset() {
  console.log('═'.repeat(100));
  console.log('CALCULATING CORRECT SCROLL-MARGIN-TOP VALUES');
  console.log('═'.repeat(100));
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 600, height: 800 },
    { name: 'Desktop', width: 1200, height: 1024 }
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

      await new Promise(resolve => setTimeout(resolve, 800));

      const data = await page.evaluate((anchorId) => {
        const header = document.querySelector('.header');
        const section = document.querySelector(anchorId);
        const h2 = section.querySelector('h2');

        const headerRect = header.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const h2Rect = h2.getBoundingClientRect();

        const currentScrollMarginTop = parseFloat(window.getComputedStyle(section).scrollMarginTop);
        const currentGap = h2Rect.top - headerRect.bottom;
        const correctScrollMarginTop = currentScrollMarginTop - currentGap;

        return {
          headerBottom: Math.round(headerRect.bottom),
          h2Top: Math.round(h2Rect.top),
          currentScrollMarginTop: Math.round(currentScrollMarginTop),
          currentGap: Math.round(currentGap),
          correctScrollMarginTop: Math.round(correctScrollMarginTop)
        };
      }, anchor);

      console.log(`${anchor}:`);
      console.log(`  Header bottom at: ${data.headerBottom}px`);
      console.log(`  H2 top at: ${data.h2Top}px`);
      console.log(`  Current scroll-margin-top: ${data.currentScrollMarginTop}px`);
      console.log(`  Current gap: ${data.currentGap}px`);
      console.log(`  ✅ CORRECT scroll-margin-top: ${data.correctScrollMarginTop}px`);
      console.log('');
    }

    console.log('');
  }

  await browser.close();

  console.log('═'.repeat(100));
  console.log('CALCULATION COMPLETE');
  console.log('═'.repeat(100));
}

measureCorrectOffset()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

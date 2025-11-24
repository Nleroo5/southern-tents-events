/**
 * MEASURE FROM TOP OF PAGE + HEADER WIDTH
 * Solution: Calculate distance from page top to H2, then add header height
 */

const puppeteer = require('puppeteer');

async function measureFromTop() {
  console.log('═'.repeat(100));
  console.log('MEASURING FROM TOP OF PAGE + HEADER WIDTH');
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
      // Load page without anchor first to get natural positions
      await page.goto('http://localhost:3000/services.html', {
        waitUntil: 'networkidle0'
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const measurements = await page.evaluate((anchorId) => {
        const header = document.querySelector('.header');
        const section = document.querySelector(anchorId);
        const h2 = section.querySelector('h2');

        const headerRect = header.getBoundingClientRect();

        // Get position relative to document (not viewport)
        const scrollY = window.scrollY;
        const h2Rect = h2.getBoundingClientRect();

        const h2TopFromPageTop = scrollY + h2Rect.top;

        return {
          headerHeight: Math.round(headerRect.height),
          h2TopFromPageTop: Math.round(h2TopFromPageTop),
          scrollMarginTop: Math.round(h2TopFromPageTop + headerRect.height)
        };
      }, anchor);

      console.log(`${anchor}:`);
      console.log(`  Header Height: ${measurements.headerHeight}px`);
      console.log(`  H2 distance from top of page: ${measurements.h2TopFromPageTop}px`);
      console.log(`  scroll-margin-top = ${measurements.h2TopFromPageTop}px + ${measurements.headerHeight}px = ${measurements.scrollMarginTop}px`);
      console.log('');
    }

    console.log('');
  }

  await browser.close();

  console.log('═'.repeat(100));
  console.log('MEASUREMENT COMPLETE');
  console.log('═'.repeat(100));
}

measureFromTop()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

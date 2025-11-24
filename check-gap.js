/**
 * CHECK ACTUAL GAP AFTER SCROLL
 */

const puppeteer = require('puppeteer');

async function checkGap() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const tests = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Desktop', width: 1200, height: 1024 }
  ];

  console.log('═'.repeat(80));
  console.log('CHECKING ACTUAL GAP');
  console.log('═'.repeat(80));
  console.log('');

  for (const test of tests) {
    await page.setViewport({ width: test.width, height: test.height });

    await page.goto('http://localhost:3000/services.html#tents', {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const h2 = document.querySelector('#tents h2');

      const headerRect = header.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      return {
        headerBottom: Math.round(headerRect.bottom),
        h2Top: Math.round(h2Rect.top),
        gap: Math.round(h2Rect.top - headerRect.bottom)
      };
    });

    console.log(`${test.name} (${test.width}x${test.height}):`);
    console.log(`  Header bottom: ${result.headerBottom}px`);
    console.log(`  H2 top: ${result.h2Top}px`);
    console.log(`  Gap: ${result.gap}px`);
    console.log('');
  }

  console.log('═'.repeat(80));

  await browser.close();
}

checkGap()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

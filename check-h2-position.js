/**
 * CHECK H2 POSITION FROM VIEWPORT TOP
 */

const puppeteer = require('puppeteer');

async function checkPosition() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const tests = [
    { name: 'Mobile', width: 375, height: 667, expectedHeaderHeight: 161 },
    { name: 'Desktop', width: 1200, height: 1024, expectedHeaderHeight: 211 }
  ];

  console.log('═'.repeat(80));
  console.log('CHECKING H2 POSITION FROM VIEWPORT TOP');
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

      const headerHeight = Math.round(header.getBoundingClientRect().height);
      const h2Top = Math.round(h2.getBoundingClientRect().top);

      return {
        headerHeight,
        h2Top,
        difference: h2Top - headerHeight
      };
    });

    console.log(`${test.name} (${test.width}x${test.height}):`);
    console.log(`  Expected header height: ${test.expectedHeaderHeight}px`);
    console.log(`  Actual header height: ${result.headerHeight}px`);
    console.log(`  H2 top from viewport: ${result.h2Top}px`);
    console.log(`  Difference (should be 0): ${result.difference}px`);

    if (result.difference === 0) {
      console.log(`  ✅ PERFECT`);
    } else if (Math.abs(result.difference) <= 5) {
      console.log(`  ✅ ACCEPTABLE (±5px)`);
    } else {
      console.log(`  ❌ GAP OF ${result.difference}px`);
    }
    console.log('');
  }

  console.log('═'.repeat(80));

  await browser.close();
}

checkPosition()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

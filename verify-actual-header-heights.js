/**
 * VERIFY ACTUAL HEADER HEIGHTS AT EACH VIEWPORT
 */

const puppeteer = require('puppeteer');

async function verifyHeaderHeights() {
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

  console.log('═'.repeat(80));
  console.log('ACTUAL HEADER HEIGHTS AT EACH VIEWPORT');
  console.log('═'.repeat(80));
  console.log('');

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });

    await page.goto('http://localhost:3000/services.html', {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    const measurement = await page.evaluate(() => {
      const header = document.querySelector('.header');
      return {
        windowWidth: window.innerWidth,
        headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null
      };
    });

    console.log(`${viewport.name} (${viewport.width}x${viewport.height}):`);
    console.log(`  Window inner width (measured): ${measurement.windowWidth}px`);
    console.log(`  Header height (measured): ${measurement.headerHeight}px`);
    console.log('');
  }

  console.log('═'.repeat(80));

  await browser.close();
}

verifyHeaderHeights()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

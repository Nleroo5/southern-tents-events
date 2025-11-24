/**
 * CORRECT AUDIT FOR ABSOLUTE HEADER
 * For absolute headers, we just check: is H2.top === headerHeight?
 */

const puppeteer = require('puppeteer');

async function correctAudit() {
  console.log('═'.repeat(100));
  console.log('CORRECT AUDIT - ABSOLUTE HEADER POSITIONING');
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

  const anchors = [
    { name: 'Tents', id: '#tents' },
    { name: 'Furniture', id: '#furniture' },
    { name: 'Lighting', id: '#lighting' }
  ];

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });

    console.log('═'.repeat(100));
    console.log(`${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log(`Expected header height: ${viewport.expectedHeaderHeight}px`);
    console.log('═'.repeat(100));
    console.log('');

    for (const anchor of anchors) {
      await page.goto(`http://localhost:3000/services.html${anchor.id}`, {
        waitUntil: 'networkidle0'
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const measurement = await page.evaluate((expectedHeight) => {
        const header = document.querySelector('.header');
        const section = document.querySelector(window.location.hash);
        const h2 = section ? section.querySelector('h2') : null;

        if (!header || !h2) {
          return { error: 'Elements not found' };
        }

        const headerRect = header.getBoundingClientRect();
        const h2Rect = h2.getBoundingClientRect();

        // For absolute headers, correct position = H2.top should equal header.height
        const actualH2Top = Math.round(h2Rect.top);
        const actualHeaderHeight = Math.round(headerRect.height);
        const gap = actualH2Top - expectedHeight;

        return {
          actualHeaderHeight,
          expectedHeaderHeight: expectedHeight,
          h2Top: actualH2Top,
          gap,
          scrollY: Math.round(window.scrollY)
        };
      }, viewport.expectedHeaderHeight);

      if (measurement.error) {
        console.log(`${anchor.name}: ❌ ERROR - ${measurement.error}`);
        continue;
      }

      const status = measurement.gap === 0 ? '✅ PERFECT' :
                     Math.abs(measurement.gap) <= 5 ? '✅ ACCEPTABLE (±5px)' :
                     measurement.gap > 0 ? `❌ TOO LOW by ${measurement.gap}px` :
                     `❌ TOO HIGH by ${Math.abs(measurement.gap)}px`;

      console.log(`${anchor.name} (${anchor.id}):`);
      console.log(`  Expected header height: ${measurement.expectedHeaderHeight}px`);
      console.log(`  Actual header height: ${measurement.actualHeaderHeight}px`);
      console.log(`  H2 top position: ${measurement.h2Top}px`);
      console.log(`  Gap (H2 top - expected height): ${measurement.gap}px`);
      console.log(`  Scroll Y: ${measurement.scrollY}px`);
      console.log(`  Status: ${status}`);
      console.log('');
    }
  }

  await browser.close();

  console.log('═'.repeat(100));
  console.log('AUDIT COMPLETE');
  console.log('═'.repeat(100));
}

correctAudit()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

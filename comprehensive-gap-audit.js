/**
 * COMPREHENSIVE GAP AUDIT
 * Check all three anchors on all viewport sizes
 */

const puppeteer = require('puppeteer');

async function comprehensiveAudit() {
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

  console.log('═'.repeat(100));
  console.log('COMPREHENSIVE GAP AUDIT - ALL ANCHORS, ALL VIEWPORTS');
  console.log('═'.repeat(100));
  console.log('');

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

      // Wait for JavaScript to execute
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await page.evaluate(() => {
        const header = document.querySelector('.header');
        const section = document.querySelector(window.location.hash);
        const h2 = section ? section.querySelector('h2') : null;

        if (!header || !h2) {
          return { error: 'Elements not found' };
        }

        const headerHeight = Math.round(header.getBoundingClientRect().height);
        const h2Top = Math.round(h2.getBoundingClientRect().top);
        const gap = h2Top - headerHeight;

        return {
          headerHeight,
          h2Top,
          gap: Math.round(gap),
          scrollY: Math.round(window.scrollY)
        };
      });

      if (result.error) {
        console.log(`${anchor.name}: ❌ ERROR - ${result.error}`);
        continue;
      }

      let status;
      if (result.gap === 0) {
        status = '✅ PERFECT';
      } else if (Math.abs(result.gap) <= 5) {
        status = '✅ ACCEPTABLE (±5px)';
      } else if (result.gap > 0) {
        status = `❌ GAP OF ${result.gap}px (H2 is ${result.gap}px too low)`;
      } else {
        status = `❌ OVERLAP OF ${Math.abs(result.gap)}px (H2 is ${Math.abs(result.gap)}px too high)`;
      }

      console.log(`${anchor.name}:`);
      console.log(`  Header height: ${result.headerHeight}px`);
      console.log(`  H2 top from viewport: ${result.h2Top}px`);
      console.log(`  Gap: ${result.gap}px`);
      console.log(`  Scroll Y: ${result.scrollY}px`);
      console.log(`  ${status}`);
      console.log('');
    }
  }

  console.log('═'.repeat(100));
  console.log('AUDIT COMPLETE');
  console.log('═'.repeat(100));

  await browser.close();
}

comprehensiveAudit()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

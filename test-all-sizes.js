/**
 * TEST ALL ANCHOR LINKS ACROSS ALL SCREEN SIZES
 */

const puppeteer = require('puppeteer');

async function testAllSizes() {
  console.log('🔍 TESTING ALL ANCHORS ACROSS ALL SCREEN SIZES\n');

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

    console.log('='.repeat(80));
    console.log(`${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log('='.repeat(80));

    for (const anchor of anchors) {
      await page.goto(`http://localhost:3000/services.html${anchor}`, {
        waitUntil: 'networkidle0'
      });

      // Give browser time to scroll and render
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await page.evaluate((anchorId) => {
        const header = document.querySelector('.header');
        const section = document.querySelector(anchorId);
        const h2 = section.querySelector('h2');

        const headerRect = header.getBoundingClientRect();
        const h2Rect = h2.getBoundingClientRect();
        const sectionStyle = window.getComputedStyle(section);

        return {
          headerBottom: Math.round(headerRect.bottom),
          h2Top: Math.round(h2Rect.top),
          gap: Math.round(h2Rect.top - headerRect.bottom),
          scrollMarginTop: sectionStyle.scrollMarginTop,
          position: sectionStyle.position
        };
      }, anchor);

      const status = result.gap === 0 ? '✅ PERFECT' : `❌ ${Math.abs(result.gap)}px gap`;
      console.log(`\n${anchor}:`);
      console.log(`  Header Bottom: ${result.headerBottom}px`);
      console.log(`  H2 Top: ${result.h2Top}px`);
      console.log(`  Gap: ${result.gap}px`);
      console.log(`  scroll-margin-top: ${result.scrollMarginTop}`);
      console.log(`  position: ${result.position}`);
      console.log(`  ${status}`);
    }

    console.log('');
  }

  await browser.close();
  console.log('='.repeat(80));
  console.log('✅ All size tests complete!\n');
}

testAllSizes()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

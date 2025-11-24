/**
 * MEASURE EXACT VALUES NEEDED FOR EACH BREAKPOINT
 */

const puppeteer = require('puppeteer');

async function measurePrecise() {
  console.log('🔍 MEASURING PRECISE VALUES FOR ALL BREAKPOINTS\n');

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

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:3000/services.html#tents', {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    const measurements = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const tents = document.querySelector('#tents');
      const tentsH2 = tents.querySelector('h2');

      const headerStyle = window.getComputedStyle(header);
      const tentsStyle = window.getComputedStyle(tents);

      const headerRect = header.getBoundingClientRect();
      const tentsRect = tents.getBoundingClientRect();
      const h2Rect = tentsH2.getBoundingClientRect();

      // Calculate what scroll-margin-top should be
      // We want: h2Rect.top === headerRect.bottom after scroll
      // Current gap
      const currentGap = h2Rect.top - headerRect.bottom;

      // Current scroll-margin-top
      const currentScrollMargin = parseFloat(tentsStyle.scrollMarginTop);

      // Needed adjustment
      const neededScrollMargin = currentScrollMargin - currentGap;

      return {
        headerHeight: Math.round(headerRect.height),
        headerBottom: Math.round(headerRect.bottom),
        sectionPaddingTop: Math.round(parseFloat(tentsStyle.paddingTop)),
        internalSpacing: Math.round(h2Rect.top - tentsRect.top),
        h2Top: Math.round(h2Rect.top),
        currentScrollMarginTop: Math.round(currentScrollMargin),
        currentGap: Math.round(currentGap),
        neededScrollMarginTop: Math.round(neededScrollMargin)
      };
    });

    console.log('='.repeat(80));
    console.log(`${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log('='.repeat(80));
    console.log(`Header Height: ${measurements.headerHeight}px`);
    console.log(`Header Bottom: ${measurements.headerBottom}px`);
    console.log(`Section Padding Top: ${measurements.sectionPaddingTop}px`);
    console.log(`Internal Spacing (section → h2): ${measurements.internalSpacing}px`);
    console.log(`H2 Top: ${measurements.h2Top}px`);
    console.log(`\nCurrent scroll-margin-top: ${measurements.currentScrollMarginTop}px`);
    console.log(`Current Gap: ${measurements.currentGap}px`);
    console.log(`\n✨ NEEDED scroll-margin-top: ${measurements.neededScrollMarginTop}px\n`);
  }

  await browser.close();
  console.log('='.repeat(80));
  console.log('✅ Measurements complete!\n');
}

measurePrecise()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

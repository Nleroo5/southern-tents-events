/**
 * MEASURE SECTION PADDING AND H2 OFFSET
 */

const puppeteer = require('puppeteer');

async function measurePadding() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  const anchors = ['#tents', '#furniture', '#lighting'];

  console.log('═'.repeat(80));
  console.log('MEASURING SECTION PADDING AND H2 OFFSET (Mobile 375px)');
  console.log('═'.repeat(80));
  console.log('');

  for (const anchor of anchors) {
    await page.goto(`http://localhost:3000/services.html${anchor}`, {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await page.evaluate(() => {
      const section = document.querySelector(window.location.hash);
      const h2 = section ? section.querySelector('h2') : null;

      if (!section || !h2) {
        return { error: 'Elements not found' };
      }

      const sectionStyles = window.getComputedStyle(section);
      const sectionPaddingTop = parseFloat(sectionStyles.paddingTop);

      const sectionRect = section.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      // Distance from section top to H2 top
      const offsetFromSection = h2Rect.top - sectionRect.top;

      return {
        sectionPaddingTop: Math.round(sectionPaddingTop),
        sectionTop: Math.round(sectionRect.top),
        h2Top: Math.round(h2Rect.top),
        offsetFromSection: Math.round(offsetFromSection)
      };
    });

    if (result.error) {
      console.log(`${anchor}: ❌ ERROR - ${result.error}`);
      continue;
    }

    console.log(`${anchor}:`);
    console.log(`  Section padding-top: ${result.sectionPaddingTop}px`);
    console.log(`  Section top: ${result.sectionTop}px`);
    console.log(`  H2 top: ${result.h2Top}px`);
    console.log(`  Offset from section to H2: ${result.offsetFromSection}px`);
    console.log('');
  }

  console.log('═'.repeat(80));

  await browser.close();
}

measurePadding()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

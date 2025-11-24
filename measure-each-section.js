/**
 * MEASURE EACH SECTION'S PADDING TO H2
 */

const puppeteer = require('puppeteer');

async function measureEachSection() {
  console.log('🔍 MEASURING EACH SECTION\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  const measurements = await page.evaluate(() => {
    const sections = ['#tents', '#furniture', '#lighting'];
    const results = {};

    sections.forEach(id => {
      const section = document.querySelector(id);
      if (!section) {
        results[id] = { error: 'Section not found' };
        return;
      }

      const h2 = section.querySelector('h2');
      if (!h2) {
        results[id] = { error: 'H2 not found' };
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      const sectionStyle = window.getComputedStyle(section);
      const sectionPaddingTop = parseFloat(sectionStyle.paddingTop);

      // Distance from section top to H2 top
      const internalSpacing = h2Rect.top - sectionRect.top;

      results[id] = {
        sectionTop: Math.round(sectionRect.top),
        sectionPaddingTop: Math.round(sectionPaddingTop),
        h2Top: Math.round(h2Rect.top),
        internalSpacing: Math.round(internalSpacing)
      };
    });

    return results;
  });

  console.log('='.repeat(80));
  console.log('SECTION INTERNAL SPACING (Section Top → H2 Top)');
  console.log('='.repeat(80));

  for (const [id, data] of Object.entries(measurements)) {
    console.log(`\n${id}:`);
    if (data.error) {
      console.log(`  ❌ ERROR: ${data.error}`);
    } else {
      console.log(`  Section Padding Top: ${data.sectionPaddingTop}px`);
      console.log(`  Internal Spacing (section top → h2 top): ${data.internalSpacing}px`);
      console.log(`  → scroll-margin-top should be: 161px - ${data.internalSpacing}px = ${161 - data.internalSpacing}px`);
    }
  }

  await browser.close();
  console.log('\n' + '='.repeat(80) + '\n');
}

measureEachSection()
  .then(() => {
    console.log('✅ Measurement complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

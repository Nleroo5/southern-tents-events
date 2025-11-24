/**
 * TEST ALL THREE ANCHOR LINKS
 */

const puppeteer = require('puppeteer');

async function testAllAnchors() {
  console.log('🔍 TESTING ALL ANCHOR LINKS\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const anchors = [
    { name: 'Tents', id: '#tents' },
    { name: 'Furniture', id: '#furniture' },
    { name: 'Lighting', id: '#lighting' }
  ];

  for (const anchor of anchors) {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 });

    await page.goto(`http://localhost:3000/services.html${anchor.id}`, {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await page.evaluate((anchorId) => {
      const header = document.querySelector('.header');
      const section = document.querySelector(anchorId);

      if (!section) {
        return { error: `Section ${anchorId} not found!` };
      }

      const h2 = section.querySelector('h2');

      if (!h2) {
        return { error: `H2 not found in section ${anchorId}!` };
      }

      const headerRect = header.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      const headerBottom = Math.round(headerRect.bottom);
      const h2Top = Math.round(h2Rect.top);
      const gap = h2Top - headerBottom;

      return {
        headerBottom,
        h2Top,
        gap,
        perfect: gap === 0
      };
    }, anchor.id);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`${anchor.name} (${anchor.id})`);
    console.log('='.repeat(60));

    if (result.error) {
      console.log(`  ❌ ERROR: ${result.error}`);
    } else {
      console.log(`  Header Bottom: ${result.headerBottom}px`);
      console.log(`  H2 Top: ${result.h2Top}px`);
      console.log(`  Gap: ${result.gap}px`);
      console.log('');

      if (result.perfect) {
        console.log(`  ✅ PERFECT! Gap is 0px`);
      } else if (result.gap > 0) {
        console.log(`  ❌ PROBLEM: ${result.gap}px gap (H2 too far down)`);
      } else {
        console.log(`  ❌ PROBLEM: ${Math.abs(result.gap)}px overlap (H2 hidden behind header)`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('\n' + '='.repeat(60) + '\n');
}

testAllAnchors()
  .then(() => {
    console.log('✅ All anchor tests complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

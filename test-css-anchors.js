/**
 * TEST CSS-BASED ANCHOR POSITIONING
 */

const puppeteer = require('puppeteer');

async function testCSSAnchors() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const tests = [
    { name: 'Mobile', width: 375, height: 667, expectedHeaderHeight: 161 },
    { name: 'Tablet', width: 600, height: 800, expectedHeaderHeight: 181 },
    { name: 'Desktop', width: 1200, height: 1024, expectedHeaderHeight: 211 }
  ];

  const anchors = ['#tents', '#furniture', '#lighting'];

  console.log('═'.repeat(80));
  console.log('TESTING CSS-BASED ANCHOR POSITIONING');
  console.log('═'.repeat(80));
  console.log('');

  for (const test of tests) {
    await page.setViewport({ width: test.width, height: test.height });

    console.log(`${test.name} (${test.width}x${test.height}):`);
    console.log('─'.repeat(80));

    for (const anchor of anchors) {
      await page.goto(`http://localhost:3000/services.html${anchor}`, {
        waitUntil: 'networkidle0'
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await page.evaluate(() => {
        const header = document.querySelector('.header');
        const anchorSpan = document.querySelector(window.location.hash);

        if (!header || !anchorSpan) {
          return { error: 'Elements not found' };
        }

        const headerHeight = Math.round(header.getBoundingClientRect().height);
        const spanTop = Math.round(anchorSpan.getBoundingClientRect().top);

        // The span should be positioned at the header bottom
        const gap = spanTop - headerHeight;

        return {
          headerHeight,
          spanTop,
          gap,
          scrollY: Math.round(window.scrollY)
        };
      });

      if (result.error) {
        console.log(`  ${anchor}: ❌ ERROR - ${result.error}`);
        continue;
      }

      let status;
      if (Math.abs(result.gap) === 0) {
        status = '✅ PERFECT';
      } else if (Math.abs(result.gap) <= 10) {
        status = '✅ ACCEPTABLE';
      } else {
        status = `❌ ${result.gap}px gap`;
      }

      console.log(`  ${anchor}: ${status} (span at ${result.spanTop}px, header ${result.headerHeight}px)`);
    }
    console.log('');
  }

  console.log('═'.repeat(80));

  await browser.close();
}

testCSSAnchors()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

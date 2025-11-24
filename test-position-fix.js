/**
 * TEST: Does position:relative on wood classes break scroll-margin-top?
 */

const puppeteer = require('puppeteer');

async function testPositionFix() {
  console.log('🧪 TESTING POSITION FIX\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  console.log('='.repeat(80));
  console.log('BEFORE FIX - Current position values:');
  console.log('='.repeat(80));

  const beforeFix = await page.evaluate(() => {
    const sections = ['#tents', '#furniture', '#lighting'];
    const results = {};

    sections.forEach(id => {
      const section = document.querySelector(id);
      if (section) {
        const style = window.getComputedStyle(section);
        results[id] = {
          position: style.position,
          scrollMarginTop: style.scrollMarginTop
        };
      }
    });

    return results;
  });

  console.log(JSON.stringify(beforeFix, null, 2));

  // Now test each anchor with current CSS
  console.log('\n' + '='.repeat(80));
  console.log('TESTING ANCHORS WITH CURRENT CSS:');
  console.log('='.repeat(80));

  for (const anchor of ['#tents', '#furniture', '#lighting']) {
    await page.goto(`http://localhost:3000/services.html${anchor}`, {
      waitUntil: 'networkidle0'
    });

    await page.waitForTimeout(500);

    const gap = await page.evaluate((anchorId) => {
      const header = document.querySelector('.header');
      const section = document.querySelector(anchorId);
      const h2 = section.querySelector('h2');

      const headerRect = header.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      return Math.round(h2Rect.top - headerRect.bottom);
    }, anchor);

    console.log(`${anchor}: ${gap}px gap`);
  }

  // Now inject CSS to override position:relative and test again
  console.log('\n' + '='.repeat(80));
  console.log('TESTING ANCHORS WITH position:static OVERRIDE:');
  console.log('='.repeat(80));

  await page.addStyleTag({
    content: `
      section[id].wood-option-1,
      section[id].wood-option-2 {
        position: static !important;
      }
    `
  });

  for (const anchor of ['#tents', '#furniture', '#lighting']) {
    await page.goto(`http://localhost:3000/services.html${anchor}`, {
      waitUntil: 'networkidle0'
    });

    // Re-inject the override after navigation
    await page.addStyleTag({
      content: `
        section[id].wood-option-1,
        section[id].wood-option-2 {
          position: static !important;
        }
      `
    });

    await page.waitForTimeout(500);

    const gap = await page.evaluate((anchorId) => {
      const header = document.querySelector('.header');
      const section = document.querySelector(anchorId);
      const h2 = section.querySelector('h2');

      const headerRect = header.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      return Math.round(h2Rect.top - headerRect.bottom);
    }, anchor);

    console.log(`${anchor}: ${gap}px gap`);
  }

  await browser.close();
  console.log('\n' + '='.repeat(80) + '\n');
}

testPositionFix()
  .then(() => {
    console.log('✅ Position test complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

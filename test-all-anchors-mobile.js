/**
 * TEST ALL THREE ANCHORS ON MOBILE
 */

const puppeteer = require('puppeteer');

async function testAllAnchors() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  // Capture console logs
  page.on('console', msg => {
    console.log('BROWSER:', msg.text());
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  const anchors = ['#tents', '#furniture', '#lighting'];

  console.log('═'.repeat(80));
  console.log('TESTING ALL ANCHORS ON MOBILE (375x667)');
  console.log('═'.repeat(80));
  console.log('');

  for (const anchor of anchors) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`Testing ${anchor}`);
    console.log('─'.repeat(80));

    await page.goto(`http://localhost:3000/services.html${anchor}`, {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const section = document.querySelector(window.location.hash);
      const h2 = section ? section.querySelector('h2') : null;

      return {
        scrollY: Math.round(window.scrollY),
        headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
        h2Top: h2 ? Math.round(h2.getBoundingClientRect().top) : null,
        gap: h2 && header ? Math.round(h2.getBoundingClientRect().top - header.getBoundingClientRect().height) : null
      };
    });

    const status = result.gap === 0 ? '✅ PERFECT' :
                   Math.abs(result.gap) <= 5 ? '✅ ACCEPTABLE' :
                   `❌ FAILED (gap: ${result.gap}px)`;

    console.log(`\nRESULT:`);
    console.log(`  Scroll Y: ${result.scrollY}px`);
    console.log(`  Header height: ${result.headerHeight}px`);
    console.log(`  H2 top: ${result.h2Top}px`);
    console.log(`  Gap: ${result.gap}px`);
    console.log(`  Status: ${status}`);
  }

  console.log('\n' + '═'.repeat(80));
  console.log('TEST COMPLETE');
  console.log('═'.repeat(80));

  await browser.close();
}

testAllAnchors()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

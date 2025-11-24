/**
 * TEST WITH CONSOLE LOGS
 */

const puppeteer = require('puppeteer');

async function testWithLogs() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  // Capture console logs
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    console.log('BROWSER:', text);
    logs.push(text);
  });

  console.log('═'.repeat(80));
  console.log('TESTING TENTS ANCHOR WITH CONSOLE LOGS');
  console.log('═'.repeat(80));
  console.log('');

  await page.goto('http://localhost:3000/services.html#tents', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const finalPosition = await page.evaluate(() => {
    const header = document.querySelector('.header');
    const h2 = document.querySelector('#tents h2');

    return {
      scrollY: window.scrollY,
      h2Top: h2 ? h2.getBoundingClientRect().top : null,
      headerHeight: header ? header.getBoundingClientRect().height : null
    };
  });

  console.log('');
  console.log('FINAL POSITION:');
  console.log(`  Scroll Y: ${finalPosition.scrollY}px`);
  console.log(`  H2 top from viewport: ${Math.round(finalPosition.h2Top)}px`);
  console.log(`  Header height: ${Math.round(finalPosition.headerHeight)}px`);
  console.log(`  Gap: ${Math.round(finalPosition.h2Top - finalPosition.headerHeight)}px`);
  console.log('');
  console.log('═'.repeat(80));

  await browser.close();
}

testWithLogs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

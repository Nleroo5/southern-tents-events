/**
 * TEST FURNITURE ONLY WITH LONGER WAIT
 */

const puppeteer = require('puppeteer');

async function testFurniture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('Testing #furniture on mobile with fresh page load...');
  console.log('');

  await page.goto('http://localhost:3000/services.html#furniture', {
    waitUntil: 'networkidle2'
  });

  // Wait for JS to execute and scroll
  await new Promise(resolve => setTimeout(resolve, 4000));

  const result = await page.evaluate(() => {
    const header = document.querySelector('.header');
    const h2 = document.querySelector('#furniture h2');

    return {
      headerHeight: Math.round(header.getBoundingClientRect().height),
      h2Top: Math.round(h2.getBoundingClientRect().top),
      gap: Math.round(h2.getBoundingClientRect().top - header.getBoundingClientRect().height),
      scrollY: Math.round(window.scrollY)
    };
  });

  console.log('Header height:', result.headerHeight + 'px');
  console.log('H2 top:', result.h2Top + 'px');
  console.log('Gap:', result.gap + 'px');
  console.log('Scroll Y:', result.scrollY + 'px');
  console.log('');

  if (result.gap === 0) {
    console.log('✅ PERFECT');
  } else if (Math.abs(result.gap) <= 5) {
    console.log('✅ ACCEPTABLE');
  } else {
    console.log(`❌ FAILED - ${result.gap}px gap`);
  }

  await browser.close();
}

testFurniture()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

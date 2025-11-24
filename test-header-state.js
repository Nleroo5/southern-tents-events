/**
 * TEST: What state is the header in when anchor loads?
 */

const puppeteer = require('puppeteer');

async function testHeaderState() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1024 });

  console.log('Testing header state when loading with anchor...\n');

  // Navigate directly to anchor
  await page.goto('http://localhost:3000/services.html#tents', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  const headerState = await page.evaluate(() => {
    const header = document.querySelector('.header');
    const hasScrolledClass = header.classList.contains('header-scrolled');
    const computedStyle = window.getComputedStyle(header);

    return {
      hasScrolledClass,
      position: computedStyle.position,
      backgroundColor: computedStyle.backgroundColor,
      scrollY: window.scrollY
    };
  });

  console.log('Header State on Anchor Load:');
  console.log(`  Has .header-scrolled class: ${headerState.hasScrolledClass}`);
  console.log(`  Position: ${headerState.position}`);
  console.log(`  Background: ${headerState.backgroundColor}`);
  console.log(`  Page scrollY: ${headerState.scrollY}px`);
  console.log('');

  if (headerState.position === 'absolute') {
    console.log('✅ CONFIRMED: Header is position:absolute when anchor loads');
    console.log('   This is why scroll-padding-top and scroll-margin-top don\'t work!');
  } else {
    console.log('Header has already switched to sticky');
  }

  await browser.close();
}

testHeaderState()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

/**
 * CHECK IF JAVASCRIPT IS ACTUALLY EXECUTING
 */

const puppeteer = require('puppeteer');

async function checkJSExecution() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Listen to console logs from the page
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });

  await page.goto('http://localhost:3000/services.html#tents', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  const result = await page.evaluate(() => {
    // Check if functions exist
    const hasInitServicesAnchorScroll = typeof initServicesAnchorScroll === 'function';
    const bodyClasses = document.body.className;
    const hasHash = window.location.hash;
    const scrollY = window.scrollY;

    return {
      hasInitServicesAnchorScroll,
      bodyClasses,
      hasHash,
      scrollY
    };
  });

  console.log('════════════════════════════════════════════════════════════════');
  console.log('JAVASCRIPT EXECUTION CHECK');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('Function exists:', result.hasInitServicesAnchorScroll);
  console.log('Body classes:', result.bodyClasses);
  console.log('Has hash:', result.hasHash);
  console.log('Scroll Y:', result.scrollY);
  console.log('════════════════════════════════════════════════════════════════');

  await browser.close();
}

checkJSExecution()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

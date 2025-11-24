/**
 * TAKE SCREENSHOT OF SERVICES PAGE
 */

const puppeteer = require('puppeteer');

async function takeScreenshot() {
  console.log('📸 TAKING SCREENSHOT\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1024 });

  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  await page.screenshot({
    path: '/tmp/services-page.png',
    fullPage: false
  });

  console.log('✅ Screenshot saved to /tmp/services-page.png\n');

  await browser.close();
}

takeScreenshot()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

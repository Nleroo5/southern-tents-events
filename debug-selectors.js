/**
 * DEBUG: Check if selectors work for all sections
 */

const puppeteer = require('puppeteer');

async function debugSelectors() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1024 });

  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  const selectorTest = await page.evaluate(() => {
    const sections = ['#tents', '#furniture', '#lighting'];
    const results = {};

    sections.forEach(sectionId => {
      const section = document.querySelector(sectionId);
      const h2 = section ? section.querySelector('h2') : null;

      results[sectionId] = {
        sectionExists: !!section,
        h2Exists: !!h2,
        h2Text: h2 ? h2.textContent.trim() : 'NOT FOUND',
        sectionClasses: section ? section.className : 'NOT FOUND'
      };
    });

    return results;
  });

  console.log('SELECTOR TEST RESULTS:');
  console.log('');
  Object.entries(selectorTest).forEach(([id, data]) => {
    console.log(`${id}:`);
    console.log(`  Section exists: ${data.sectionExists ? '✅' : '❌'}`);
    console.log(`  H2 exists: ${data.h2Exists ? '✅' : '❌'}`);
    console.log(`  H2 text: "${data.h2Text}"`);
    console.log(`  Section classes: ${data.sectionClasses}`);
    console.log('');
  });

  await browser.close();
}

debugSelectors()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

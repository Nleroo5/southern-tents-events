/**
 * DEBUG FURNITURE ON MOBILE
 */

const puppeteer = require('puppeteer');

async function debugFurniture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  console.log('═'.repeat(80));
  console.log('DEBUGGING FURNITURE ANCHOR ON MOBILE');
  console.log('═'.repeat(80));
  console.log('');

  await page.goto('http://localhost:3000/services.html#furniture', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  const result = await page.evaluate(() => {
    const section = document.querySelector('#furniture');
    const h2 = section.querySelector('h2');
    const container = section.querySelector('.container');
    const titleDecorated = section.querySelector('.section-title-decorated');

    return {
      sectionTop: Math.round(section.getBoundingClientRect().top),
      containerTop: container ? Math.round(container.getBoundingClientRect().top) : null,
      titleDecoratedTop: titleDecorated ? Math.round(titleDecorated.getBoundingClientRect().top) : null,
      h2Top: Math.round(h2.getBoundingClientRect().top),
      sectionPadding: window.getComputedStyle(section).paddingTop,
      containerPadding: container ? window.getComputedStyle(container).paddingTop : null,
      titleDecoratedMargin: titleDecorated ? window.getComputedStyle(titleDecorated).marginBottom : null,
      h2Margin: window.getComputedStyle(h2).marginBottom,
      scrollY: Math.round(window.scrollY)
    };
  });

  console.log('Section top:', result.sectionTop + 'px');
  console.log('Container top:', result.containerTop + 'px');
  console.log('Title-decorated top:', result.titleDecoratedTop + 'px');
  console.log('H2 top:', result.h2Top + 'px');
  console.log('');
  console.log('Section padding-top:', result.sectionPadding);
  console.log('Container padding-top:', result.containerPadding);
  console.log('Title-decorated margin-bottom:', result.titleDecoratedMargin);
  console.log('H2 margin-bottom:', result.h2Margin);
  console.log('');
  console.log('Scroll Y:', result.scrollY + 'px');
  console.log('Gap from section to H2:', (result.h2Top - result.sectionTop) + 'px');
  console.log('');
  console.log('═'.repeat(80));

  await browser.close();
}

debugFurniture()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

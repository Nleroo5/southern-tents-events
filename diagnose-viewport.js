/**
 * VIEWPORT DIAGNOSIS - Where is everything relative to the VISIBLE viewport?
 */

const puppeteer = require('puppeteer');

async function diagnoseViewport() {
  console.log('🔍 VIEWPORT POSITION DIAGNOSIS\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  await page.goto('http://localhost:3000/services.html#tents', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 1500));

  const diagnosis = await page.evaluate(() => {
    const header = document.querySelector('.header');
    const section = document.querySelector('#tents');
    const h2 = section.querySelector('h2');

    const headerRect = header.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const h2Rect = h2.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    return {
      viewportHeight,
      viewportTop: 0,

      headerTop: Math.round(headerRect.top),
      headerBottom: Math.round(headerRect.bottom),
      headerHeight: Math.round(headerRect.height),

      sectionTop: Math.round(sectionRect.top),

      h2Top: Math.round(h2Rect.top),
      h2Bottom: Math.round(h2Rect.bottom),

      // Key measurement: where is h2 in the viewport?
      h2VisibleInViewport: h2Rect.top >= 0 && h2Rect.top < viewportHeight,
      h2OffsetFromViewportTop: Math.round(h2Rect.top),

      // What we want: h2 should be at headerBottom position
      idealH2Position: Math.round(headerRect.bottom),
      currentH2Position: Math.round(h2Rect.top),
      positionError: Math.round(h2Rect.top - headerRect.bottom)
    };
  });

  console.log('='.repeat(80));
  console.log('VIEWPORT POSITIONS (Mobile 375px)');
  console.log('='.repeat(80));
  console.log(`  Viewport Height: ${diagnosis.viewportHeight}px`);
  console.log('');
  console.log(`  Header Top: ${diagnosis.headerTop}px`);
  console.log(`  Header Bottom: ${diagnosis.headerBottom}px`);
  console.log(`  Header Height: ${diagnosis.headerHeight}px`);
  console.log('');
  console.log(`  Section Top: ${diagnosis.sectionTop}px`);
  console.log(`  H2 Title Top: ${diagnosis.h2Top}px`);
  console.log('');
  console.log(`  ✅ Ideal H2 Position: ${diagnosis.idealH2Position}px (right below header)`);
  console.log(`  ❌ Current H2 Position: ${diagnosis.currentH2Position}px`);
  console.log(`  📏 Error: ${diagnosis.positionError > 0 ? '+' : ''}${diagnosis.positionError}px`);
  console.log('');

  if (diagnosis.positionError === 0) {
    console.log(`  ✅ PERFECT! H2 is exactly at header bottom`);
  } else if (diagnosis.positionError > 0) {
    console.log(`  ❌ PROBLEM: H2 is ${diagnosis.positionError}px TOO FAR DOWN (gap below header)`);
    console.log(`  🔧 scroll-margin-top needs to be LARGER by ${diagnosis.positionError}px`);
  } else {
    console.log(`  ❌ PROBLEM: H2 is ${Math.abs(diagnosis.positionError)}px HIDDEN behind header`);
    console.log(`  🔧 scroll-margin-top needs to be SMALLER by ${Math.abs(diagnosis.positionError)}px`);
  }

  await browser.close();
  console.log('\n' + '='.repeat(80) + '\n');
}

diagnoseViewport()
  .then(() => {
    console.log('✅ Viewport diagnosis complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

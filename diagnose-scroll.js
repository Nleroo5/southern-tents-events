/**
 * DIAGNOSE - Show actual scroll behavior and what's REALLY wrong
 */

const puppeteer = require('puppeteer');

async function diagnoseScroll() {
  console.log('🔍 DIAGNOSING SCROLL BEHAVIOR\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const breakpoints = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Desktop (1024px)', width: 1024, height: 768 }
  ];

  for (const breakpoint of breakpoints) {
    const page = await browser.newPage();
    await page.setViewport({
      width: breakpoint.width,
      height: breakpoint.height,
      deviceScaleFactor: 1
    });

    // Navigate and let it scroll to anchor
    await page.goto('http://localhost:3000/services.html#tents', {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    const diagnosis = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const section = document.querySelector('#tents');
      const h2 = section.querySelector('h2');

      // Get positions
      const headerRect = header.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      // Get computed scroll-margin
      const sectionStyle = window.getComputedStyle(section);
      const appliedScrollMargin = sectionStyle.scrollMarginTop;

      // Calculate the gap
      const headerBottom = headerRect.bottom;
      const h2Top = h2Rect.top;
      const actualGap = h2Top - headerBottom;

      return {
        headerHeight: Math.round(headerRect.height),
        headerBottom: Math.round(headerBottom),
        h2Top: Math.round(h2Top),
        actualGap: Math.round(actualGap),
        appliedScrollMargin: appliedScrollMargin,

        // What user wants
        idealGap: 0, // header bottom should touch h2 top

        // What correction is needed
        correctionNeeded: Math.round(actualGap)
      };
    });

    console.log(`\n${'='.repeat(80)}`);
    console.log(`${breakpoint.name}`);
    console.log('='.repeat(80));
    console.log(`  Applied scroll-margin-top: ${diagnosis.appliedScrollMargin}`);
    console.log(`  Header Height: ${diagnosis.headerHeight}px`);
    console.log(`  Header Bottom Position: ${diagnosis.headerBottom}px`);
    console.log(`  H2 Title Top Position: ${diagnosis.h2Top}px`);
    console.log('');
    console.log(`  ❌ Current Gap: ${diagnosis.actualGap}px`);
    console.log(`  ✅ Ideal Gap: ${diagnosis.idealGap}px (header bottom touching h2 top)`);
    console.log('');

    if (diagnosis.actualGap > 0) {
      console.log(`  🔧 PROBLEM: Gap is ${diagnosis.actualGap}px TOO LARGE`);
      console.log(`  🔧 FIX: DECREASE scroll-margin-top by ${diagnosis.actualGap}px`);
      const currentValue = parseInt(diagnosis.appliedScrollMargin);
      const newValue = currentValue - diagnosis.actualGap;
      console.log(`  🔧 NEW VALUE: ${currentValue}px → ${newValue}px`);
    } else if (diagnosis.actualGap < 0) {
      console.log(`  🔧 PROBLEM: Title is ${Math.abs(diagnosis.actualGap)}px HIDDEN behind header`);
      console.log(`  🔧 FIX: INCREASE scroll-margin-top by ${Math.abs(diagnosis.actualGap)}px`);
      const currentValue = parseInt(diagnosis.appliedScrollMargin);
      const newValue = currentValue + Math.abs(diagnosis.actualGap);
      console.log(`  🔧 NEW VALUE: ${currentValue}px → ${newValue}px`);
    } else {
      console.log(`  ✅ PERFECT! No gap, header bottom aligned with h2 top`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n' + '='.repeat(80) + '\n');
}

diagnoseScroll()
  .then(() => {
    console.log('✅ Diagnosis complete!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

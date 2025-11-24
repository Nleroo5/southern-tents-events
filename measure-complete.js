/**
 * COMPLETE MEASUREMENT - Header + Section Padding + Title Position
 */

const puppeteer = require('puppeteer');

async function measureComplete() {
  console.log('🔍 COMPLETE ANCHOR LINK MEASUREMENT\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const breakpoints = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Tablet (600px)', width: 600, height: 960 },
    { name: 'Desktop (1024px)', width: 1024, height: 768 }
  ];

  console.log('═'.repeat(80));
  console.log('MEASURING ACTUAL SCROLL BEHAVIOR');
  console.log('═'.repeat(80));
  console.log('');

  for (const breakpoint of breakpoints) {
    const page = await browser.newPage();
    await page.setViewport({
      width: breakpoint.width,
      height: breakpoint.height,
      deviceScaleFactor: 1
    });

    await page.goto('http://localhost:3000/services.html#tents', {
      waitUntil: 'networkidle0'
    });

    // Wait for everything to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    const measurements = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const section = document.querySelector('#tents');
      const sectionTitleDecorated = section.querySelector('.section-title-decorated');
      const h2 = sectionTitleDecorated.querySelector('h2');

      // Get all measurements
      const headerRect = header.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      // Get computed styles
      const sectionStyle = window.getComputedStyle(section);
      const containerStyle = window.getComputedStyle(section.querySelector('.container'));
      const titleDecoratedStyle = window.getComputedStyle(sectionTitleDecorated);

      return {
        // Header measurements
        headerHeight: Math.round(headerRect.height),
        headerBottom: Math.round(headerRect.bottom),

        // Section measurements
        sectionTop: Math.round(sectionRect.top),
        sectionPaddingTop: parseFloat(sectionStyle.paddingTop),

        // Container measurements (if any)
        containerPaddingTop: parseFloat(containerStyle.paddingTop),

        // Title measurements
        titleDecoratedMarginTop: parseFloat(titleDecoratedStyle.marginTop),
        titleDecoratedMarginBottom: parseFloat(titleDecoratedStyle.marginBottom),
        h2Top: Math.round(h2Rect.top),

        // The critical measurement: distance from section top to h2 top
        sectionTopToTitleTop: Math.round(h2Rect.top - sectionRect.top),

        // What we actually want: header bottom to h2 top gap
        currentGap: Math.round(h2Rect.top - headerRect.bottom),

        // The answer: what scroll-margin-top should be
        idealScrollMargin: Math.round(headerRect.height + (h2Rect.top - sectionRect.top))
      };
    });

    console.log(`\n${breakpoint.name}:`);
    console.log('─'.repeat(80));
    console.log(`  Header Height: ${measurements.headerHeight}px`);
    console.log(`  Header Bottom Position: ${measurements.headerBottom}px`);
    console.log('');
    console.log(`  Section Top Position: ${measurements.sectionTop}px`);
    console.log(`  Section Padding Top: ${measurements.sectionPaddingTop}px`);
    console.log(`  Container Padding Top: ${measurements.containerPaddingTop}px`);
    console.log(`  Title Decorated Margin Top: ${measurements.titleDecoratedMarginTop}px`);
    console.log('');
    console.log(`  H2 Title Top Position: ${measurements.h2Top}px`);
    console.log(`  Distance from Section Top to Title Top: ${measurements.sectionTopToTitleTop}px`);
    console.log('');
    console.log(`  ❌ Current Gap (Header Bottom → Title Top): ${measurements.currentGap}px`);
    console.log('');
    console.log(`  ✅ CORRECT scroll-margin-top VALUE: ${measurements.idealScrollMargin}px`);
    console.log(`     (${measurements.headerHeight}px header + ${measurements.sectionTopToTitleTop}px section spacing)`);

    await page.close();
  }

  await browser.close();

  console.log('\n' + '═'.repeat(80));
  console.log('');
}

measureComplete()
  .then(() => {
    console.log('✅ Complete measurement done!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

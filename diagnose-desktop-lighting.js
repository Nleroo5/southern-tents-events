/**
 * DIAGNOSE DESKTOP LIGHTING ANCHOR ISSUE
 */

const puppeteer = require('puppeteer');

async function diagnoseLighting() {
  console.log('🔍 DIAGNOSING DESKTOP LIGHTING ANCHOR\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1024 });

  // Test each section on desktop
  for (const anchor of ['#tents', '#furniture', '#lighting']) {
    console.log('='.repeat(80));
    console.log(`DESKTOP ${anchor.toUpperCase()}`);
    console.log('='.repeat(80));

    await page.goto(`http://localhost:3000/services.html${anchor}`, {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await page.evaluate((anchorId) => {
      const section = document.querySelector(anchorId);
      const header = document.querySelector('.header');
      const h2 = section.querySelector('h2');

      const sectionRect = section.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const h2Rect = h2.getBoundingClientRect();

      const sectionStyle = window.getComputedStyle(section);

      return {
        // Section info
        sectionId: anchorId,
        sectionTop: Math.round(sectionRect.top),
        sectionClasses: section.className,
        sectionInlineStyle: section.getAttribute('style'),

        // Computed styles
        position: sectionStyle.position,
        scrollMarginTop: sectionStyle.scrollMarginTop,
        paddingTop: sectionStyle.paddingTop,
        marginTop: sectionStyle.marginTop,

        // Positions
        headerBottom: Math.round(headerRect.bottom),
        h2Top: Math.round(h2Rect.top),
        gap: Math.round(h2Rect.top - headerRect.bottom),

        // Internal spacing
        internalSpacing: Math.round(h2Rect.top - sectionRect.top)
      };
    }, anchor);

    console.log(`Section ID: ${result.sectionId}`);
    console.log(`Section Classes: ${result.sectionClasses}`);
    console.log(`Section Inline Style: ${result.sectionInlineStyle}`);
    console.log(`\nComputed Styles:`);
    console.log(`  position: ${result.position}`);
    console.log(`  scroll-margin-top: ${result.scrollMarginTop}`);
    console.log(`  padding-top: ${result.paddingTop}`);
    console.log(`  margin-top: ${result.marginTop}`);
    console.log(`\nPositions:`);
    console.log(`  Section Top: ${result.sectionTop}px`);
    console.log(`  Header Bottom: ${result.headerBottom}px`);
    console.log(`  H2 Top: ${result.h2Top}px`);
    console.log(`  Gap: ${result.gap}px`);
    console.log(`  Internal Spacing: ${result.internalSpacing}px`);
    console.log('');
  }

  await browser.close();
  console.log('='.repeat(80));
  console.log('✅ Diagnosis complete!\n');
}

diagnoseLighting()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

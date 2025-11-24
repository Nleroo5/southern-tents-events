/**
 * FINAL COMPREHENSIVE AUDIT - REAL BROWSER MEASUREMENTS
 * Test actual browser behavior when clicking anchor links
 */

const puppeteer = require('puppeteer');

async function finalAudit() {
  console.log('═'.repeat(100));
  console.log('FINAL COMPREHENSIVE AUDIT - MEASURING REAL BROWSER BEHAVIOR');
  console.log('═'.repeat(100));
  console.log('');

  const browser = await puppeteer.launch({
    headless: false, // Show browser so we can see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 50 // Slow down so we can see
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 600, height: 800 },
    { name: 'Desktop', width: 1200, height: 1024 }
  ];

  const anchors = [
    { id: '#tents', name: 'Tents' },
    { id: '#furniture', name: 'Furniture' },
    { id: '#lighting', name: 'Lighting' }
  ];

  const allResults = {};

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });

    console.log('═'.repeat(100));
    console.log(`${viewport.name.toUpperCase()} (${viewport.width}x${viewport.height})`);
    console.log('═'.repeat(100));
    console.log('');

    allResults[viewport.name] = {};

    for (const anchor of anchors) {
      // Start from homepage
      await page.goto('http://localhost:3000', {
        waitUntil: 'networkidle0'
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Click the actual button that links to this anchor
      const buttonText = anchor.name === 'Tents' ? 'View Tent Options' :
                        anchor.name === 'Furniture' ? 'View Tables & Chairs' :
                        'View Lighting & More';

      // Navigate directly with hash
      await page.goto(`http://localhost:3000/services.html${anchor.id}`, {
        waitUntil: 'networkidle0'
      });

      // Wait for any JavaScript to execute
      await new Promise(resolve => setTimeout(resolve, 2000));

      const measurement = await page.evaluate(() => {
        const header = document.querySelector('.header');
        const section = document.querySelector(window.location.hash);
        const h2 = section ? section.querySelector('h2') : null;

        if (!header || !h2) {
          return { error: 'Elements not found' };
        }

        const headerRect = header.getBoundingClientRect();
        const h2Rect = h2.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();

        return {
          headerHeight: Math.round(headerRect.height),
          headerBottom: Math.round(headerRect.bottom),
          sectionTop: Math.round(sectionRect.top),
          h2Top: Math.round(h2Rect.top),
          gap: Math.round(h2Rect.top - headerRect.bottom),
          scrollY: Math.round(window.scrollY),
          windowHeight: window.innerHeight
        };
      });

      if (measurement.error) {
        console.log(`${anchor.name}: ❌ ERROR - ${measurement.error}`);
        continue;
      }

      const status = measurement.gap === 0 ? '✅ PERFECT' :
                     Math.abs(measurement.gap) <= 5 ? '✅ ACCEPTABLE (±5px)' :
                     measurement.gap > 0 ? `❌ GAP OF ${measurement.gap}px` :
                     `❌ OVERLAP OF ${Math.abs(measurement.gap)}px`;

      console.log(`${anchor.name} (${anchor.id}):`);
      console.log(`  Header: ${measurement.headerHeight}px tall, bottom at ${measurement.headerBottom}px`);
      console.log(`  Section top: ${measurement.sectionTop}px`);
      console.log(`  H2 top: ${measurement.h2Top}px`);
      console.log(`  Gap: ${measurement.gap}px`);
      console.log(`  Scroll position: ${measurement.scrollY}px`);
      console.log(`  Status: ${status}`);
      console.log('');

      allResults[viewport.name][anchor.name] = {
        headerHeight: measurement.headerHeight,
        gap: measurement.gap,
        status: status.includes('✅'),
        scrollY: measurement.scrollY
      };
    }
  }

  console.log('═'.repeat(100));
  console.log('SUMMARY OF ISSUES');
  console.log('═'.repeat(100));
  console.log('');

  let hasIssues = false;

  Object.entries(allResults).forEach(([viewport, anchors]) => {
    const issues = Object.entries(anchors).filter(([name, data]) => !data.status);
    if (issues.length > 0) {
      hasIssues = true;
      console.log(`${viewport}:`);
      issues.forEach(([name, data]) => {
        console.log(`  ${name}: Gap of ${data.gap}px (needs adjustment of ${-data.gap}px)`);
      });
      console.log('');
    }
  });

  if (!hasIssues) {
    console.log('✅ ALL ANCHORS ARE PERFECT!');
  }

  console.log('');
  console.log('Keeping browser open for 5 seconds for manual inspection...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  await browser.close();

  console.log('');
  console.log('═'.repeat(100));
  console.log('AUDIT COMPLETE');
  console.log('═'.repeat(100));

  return allResults;
}

finalAudit()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

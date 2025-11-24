/**
 * Precise Header Height Measurement Tool
 * Uses headless browser to measure EXACT header heights at all breakpoints
 */

const puppeteer = require('puppeteer');

async function measureHeaderHeights() {
  console.log('🔍 Starting precise header measurement...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const breakpoints = [
    { name: 'Mobile Small (375px)', width: 375, height: 667 },
    { name: 'Mobile Medium (414px)', width: 414, height: 896 },
    { name: 'Mobile Large (480px)', width: 480, height: 854 },
    { name: 'Tablet Small (600px)', width: 600, height: 960 },
    { name: 'Tablet Large (768px)', width: 768, height: 1024 },
    { name: 'Desktop Small (1024px)', width: 1024, height: 768 },
    { name: 'Desktop Medium (1280px)', width: 1280, height: 720 },
    { name: 'Desktop Large (1920px)', width: 1920, height: 1080 }
  ];

  const measurements = [];

  for (const breakpoint of breakpoints) {
    const page = await browser.newPage();
    await page.setViewport({
      width: breakpoint.width,
      height: breakpoint.height,
      deviceScaleFactor: 1
    });

    await page.goto('http://localhost:3000/services.html', {
      waitUntil: 'networkidle0'
    });

    // Wait for page to fully render
    await page.waitForSelector('.header');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Measure header height using multiple methods
    const headerData = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const nav = document.querySelector('.nav');
      const logo = document.querySelector('.nav-logo');

      const headerRect = header.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();

      const headerComputedStyle = window.getComputedStyle(header);
      const navComputedStyle = window.getComputedStyle(nav);

      return {
        // Header measurements
        headerOffsetHeight: header.offsetHeight,
        headerClientHeight: header.clientHeight,
        headerBCRHeight: Math.round(headerRect.height),
        headerComputedHeight: parseFloat(headerComputedStyle.height),

        // Nav measurements
        navOffsetHeight: nav.offsetHeight,
        navBCRHeight: Math.round(navRect.height),
        navPaddingTop: parseFloat(navComputedStyle.paddingTop),
        navPaddingBottom: parseFloat(navComputedStyle.paddingBottom),

        // Logo measurements
        logoHeight: Math.round(logoRect.height),
        logoComputedHeight: parseFloat(window.getComputedStyle(logo).height)
      };
    });

    measurements.push({
      breakpoint: breakpoint.name,
      width: breakpoint.width,
      ...headerData
    });

    await page.close();
  }

  await browser.close();

  // Display results
  console.log('═'.repeat(80));
  console.log('PRECISE HEADER HEIGHT MEASUREMENTS');
  console.log('═'.repeat(80));
  console.log('');

  // Group by CSS breakpoint
  const grouped = {
    mobile: measurements.filter(m => m.width <= 480),
    tablet: measurements.filter(m => m.width > 480 && m.width <= 767),
    desktop: measurements.filter(m => m.width >= 768)
  };

  for (const [category, items] of Object.entries(grouped)) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${category.toUpperCase()} BREAKPOINT`);
    console.log('='.repeat(80));

    items.forEach(item => {
      console.log(`\n${item.breakpoint}:`);
      console.log(`  Screen Width: ${item.width}px`);
      console.log(`  ─────────────────────────────────────`);
      console.log(`  Logo Height: ${item.logoHeight}px`);
      console.log(`  Nav Padding Top: ${item.navPaddingTop}px`);
      console.log(`  Nav Padding Bottom: ${item.navPaddingBottom}px`);
      console.log(`  ─────────────────────────────────────`);
      console.log(`  Header Height (BCR): ${item.headerBCRHeight}px`);
      console.log(`  Header Height (Offset): ${item.headerOffsetHeight}px`);
      console.log(`  ─────────────────────────────────────`);
      console.log(`  ✅ USE THIS VALUE: ${item.headerBCRHeight}px`);
    });
  }

  // Calculate recommended values
  console.log('\n\n');
  console.log('═'.repeat(80));
  console.log('RECOMMENDED scroll-margin-top VALUES FOR CSS');
  console.log('═'.repeat(80));

  const mobileMax = Math.max(...grouped.mobile.map(m => m.headerBCRHeight));
  const tabletMax = Math.max(...grouped.tablet.map(m => m.headerBCRHeight));
  const desktopMax = Math.max(...grouped.desktop.map(m => m.headerBCRHeight));

  console.log('\n/* Mobile (≤480px) */');
  console.log(`section[id] {`);
  console.log(`  scroll-margin-top: ${mobileMax}px;`);
  console.log(`}`);

  console.log('\n/* Tablet (481-767px) */');
  console.log(`@media (min-width: 481px) and (max-width: 767px) {`);
  console.log(`  section[id] {`);
  console.log(`    scroll-margin-top: ${tabletMax}px;`);
  console.log(`  }`);
  console.log(`}`);

  console.log('\n/* Desktop (≥768px) */');
  console.log(`@media (min-width: 768px) {`);
  console.log(`  section[id] {`);
  console.log(`    scroll-margin-top: ${desktopMax}px;`);
  console.log(`  }`);
  console.log(`}`);

  console.log('\n' + '═'.repeat(80));
  console.log('');

  return {
    mobile: mobileMax,
    tablet: tabletMax,
    desktop: desktopMax
  };
}

// Run measurement
measureHeaderHeights()
  .then(values => {
    console.log('✅ Measurement complete!');
    console.log(`\nFinal Values: Mobile=${values.mobile}px, Tablet=${values.tablet}px, Desktop=${values.desktop}px\n`);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

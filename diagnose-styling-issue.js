/**
 * COMPREHENSIVE STYLING DIAGNOSTIC
 * Identify what's breaking the site styling
 */

const puppeteer = require('puppeteer');

async function diagnoseStyling() {
  console.log('═'.repeat(100));
  console.log('COMPREHENSIVE STYLING DIAGNOSTIC');
  console.log('═'.repeat(100));
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1024 });

  // Test homepage
  console.log('Testing Homepage (http://localhost:3000)...\n');
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0'
  });

  const homePageData = await page.evaluate(() => {
    const body = document.body;
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const h1 = document.querySelector('h1');

    const bodyStyle = window.getComputedStyle(body);
    const headerStyle = header ? window.getComputedStyle(header) : null;
    const heroStyle = hero ? window.getComputedStyle(hero) : null;
    const h1Style = h1 ? window.getComputedStyle(h1) : null;

    return {
      bodyBackground: bodyStyle.backgroundColor,
      bodyFont: bodyStyle.fontFamily,
      bodyColor: bodyStyle.color,
      headerPosition: headerStyle?.position,
      headerBackground: headerStyle?.backgroundColor,
      heroBackground: heroStyle?.backgroundImage,
      h1Color: h1Style?.color,
      h1FontFamily: h1Style?.fontFamily,
      cssVariablesWork: bodyStyle.getPropertyValue('--color-primary') || 'NOT FOUND',
      stylesheetsLoaded: Array.from(document.styleSheets).map(s => s.href || 'inline').filter(h => h.includes('styles'))
    };
  });

  console.log('Homepage Styling:');
  console.log(`  Body Background: ${homePageData.bodyBackground}`);
  console.log(`  Body Font: ${homePageData.bodyFont}`);
  console.log(`  Body Color: ${homePageData.bodyColor}`);
  console.log(`  Header Position: ${homePageData.headerPosition}`);
  console.log(`  Header Background: ${homePageData.headerBackground}`);
  console.log(`  Hero Background: ${homePageData.heroBackground?.substring(0, 100)}...`);
  console.log(`  H1 Color: ${homePageData.h1Color}`);
  console.log(`  H1 Font: ${homePageData.h1FontFamily}`);
  console.log(`  CSS Variable --color-primary: ${homePageData.cssVariablesWork}`);
  console.log(`  Stylesheets Loaded: ${homePageData.stylesheetsLoaded.join(', ')}`);
  console.log('');

  // Test services page
  console.log('Testing Services Page (http://localhost:3000/services.html)...\n');
  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  const servicesPageData = await page.evaluate(() => {
    const body = document.body;
    const header = document.querySelector('.header');
    const section = document.querySelector('.section');
    const h2 = document.querySelector('h2');

    const bodyStyle = window.getComputedStyle(body);
    const headerStyle = header ? window.getComputedStyle(header) : null;
    const sectionStyle = section ? window.getComputedStyle(section) : null;
    const h2Style = h2 ? window.getComputedStyle(h2) : null;

    return {
      bodyBackground: bodyStyle.backgroundColor,
      bodyFont: bodyStyle.fontFamily,
      bodyColor: bodyStyle.color,
      headerPosition: headerStyle?.position,
      headerBackground: headerStyle?.backgroundColor,
      sectionBackground: sectionStyle?.backgroundColor,
      h2Color: h2Style?.color,
      h2FontFamily: h2Style?.fontFamily,
      cssVariablesWork: bodyStyle.getPropertyValue('--color-primary') || 'NOT FOUND',
      stylesheetsLoaded: Array.from(document.styleSheets).map(s => s.href || 'inline').filter(h => h.includes('styles'))
    };
  });

  console.log('Services Page Styling:');
  console.log(`  Body Background: ${servicesPageData.bodyBackground}`);
  console.log(`  Body Font: ${servicesPageData.bodyFont}`);
  console.log(`  Body Color: ${servicesPageData.bodyColor}`);
  console.log(`  Header Position: ${servicesPageData.headerPosition}`);
  console.log(`  Header Background: ${servicesPageData.headerBackground}`);
  console.log(`  Section Background: ${servicesPageData.sectionBackground}`);
  console.log(`  H2 Color: ${servicesPageData.h2Color}`);
  console.log(`  H2 Font: ${servicesPageData.h2FontFamily}`);
  console.log(`  CSS Variable --color-primary: ${servicesPageData.cssVariablesWork}`);
  console.log(`  Stylesheets Loaded: ${servicesPageData.stylesheetsLoaded.join(', ')}`);
  console.log('');

  // Check for console errors
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Console Errors/Warnings:');
  if (consoleMessages.length === 0) {
    console.log('  ✅ No console errors or warnings');
  } else {
    consoleMessages.forEach(msg => console.log(`  ${msg}`));
  }
  console.log('');

  await browser.close();

  console.log('═'.repeat(100));
  console.log('DIAGNOSTIC COMPLETE');
  console.log('═'.repeat(100));

  // Provide diagnosis
  console.log('');
  console.log('DIAGNOSIS:');
  if (homePageData.cssVariablesWork === 'NOT FOUND' || servicesPageData.cssVariablesWork === 'NOT FOUND') {
    console.log('❌ CSS VARIABLES ARE MISSING - styles.min.css is broken or not loading!');
  } else if (homePageData.cssVariablesWork.includes('#c9a86a')) {
    console.log('✅ CSS VARIABLES ARE WORKING CORRECTLY');
    console.log('✅ Site styling should be intact');
  }
}

diagnoseStyling()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

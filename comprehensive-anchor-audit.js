/**
 * COMPREHENSIVE ANCHOR SCROLL AUDIT
 * Professional analysis of all variables affecting anchor scroll positioning
 */

const puppeteer = require('puppeteer');

async function comprehensiveAudit() {
  console.log('═'.repeat(100));
  console.log('COMPREHENSIVE ANCHOR SCROLL POSITIONING AUDIT');
  console.log('═'.repeat(100));
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 600, height: 800 },
    { name: 'Desktop', width: 1200, height: 1024 }
  ];

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height });

    console.log('═'.repeat(100));
    console.log(`${viewport.name.toUpperCase()} VIEWPORT (${viewport.width}x${viewport.height})`);
    console.log('═'.repeat(100));
    console.log('');

    // First, load the services page to measure static elements
    await page.goto('http://localhost:3000/services.html', {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // SECTION 1: HEADER ANALYSIS
    console.log('┌─────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ SECTION 1: HEADER DIMENSIONS & PROPERTIES                                      │');
    console.log('└─────────────────────────────────────────────────────────────────────────────────┘');
    console.log('');

    const headerData = await page.evaluate(() => {
      const header = document.querySelector('.header');
      const nav = document.querySelector('.nav');
      const logo = document.querySelector('.nav-logo');

      const headerRect = header.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const logoRect = logo ? logo.getBoundingClientRect() : null;

      const headerStyle = window.getComputedStyle(header);
      const navStyle = window.getComputedStyle(nav);

      return {
        header: {
          position: headerStyle.position,
          top: headerStyle.top,
          zIndex: headerStyle.zIndex,
          backgroundColor: headerStyle.backgroundColor,
          borderBottom: headerStyle.borderBottom,
          paddingTop: parseFloat(headerStyle.paddingTop),
          paddingBottom: parseFloat(headerStyle.paddingBottom),
          height: Math.round(headerRect.height),
          width: Math.round(headerRect.width),
          top: Math.round(headerRect.top),
          bottom: Math.round(headerRect.bottom)
        },
        nav: {
          paddingTop: parseFloat(navStyle.paddingTop),
          paddingBottom: parseFloat(navStyle.paddingBottom),
          height: Math.round(navRect.height)
        },
        logo: logoRect ? {
          height: Math.round(logoRect.height),
          width: Math.round(logoRect.width)
        } : null
      };
    });

    console.log('Header Element:');
    console.log(`  Position: ${headerData.header.position}`);
    console.log(`  Top: ${headerData.header.top}`);
    console.log(`  Z-Index: ${headerData.header.zIndex}`);
    console.log(`  Background: ${headerData.header.backgroundColor}`);
    console.log(`  Border Bottom: ${headerData.header.borderBottom}`);
    console.log(`  Padding: ${headerData.header.paddingTop}px top, ${headerData.header.paddingBottom}px bottom`);
    console.log(`  Total Height: ${headerData.header.height}px`);
    console.log(`  Width: ${headerData.header.width}px`);
    console.log(`  Position in Viewport: top=${headerData.header.top}px, bottom=${headerData.header.bottom}px`);
    console.log('');
    console.log('Nav Element:');
    console.log(`  Padding: ${headerData.nav.paddingTop}px top, ${headerData.nav.paddingBottom}px bottom`);
    console.log(`  Height: ${headerData.nav.height}px`);
    console.log('');
    if (headerData.logo) {
      console.log('Logo:');
      console.log(`  Height: ${headerData.logo.height}px`);
      console.log(`  Width: ${headerData.logo.width}px`);
    }
    console.log('');

    // SECTION 2: ANALYZE EACH ANCHOR TARGET
    const anchors = ['#tents', '#furniture', '#lighting'];

    for (const anchor of anchors) {
      console.log('┌─────────────────────────────────────────────────────────────────────────────────┐');
      console.log(`│ SECTION 2: ANCHOR TARGET ANALYSIS - ${anchor.toUpperCase().padEnd(48)}│`);
      console.log('└─────────────────────────────────────────────────────────────────────────────────┘');
      console.log('');

      // Navigate to the anchor
      await page.goto(`http://localhost:3000/services.html${anchor}`, {
        waitUntil: 'networkidle0'
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      const anchorData = await page.evaluate((anchorId) => {
        const section = document.querySelector(anchorId);
        const container = section.querySelector('.container');
        const titleDecorated = section.querySelector('.section-title-decorated');
        const h2 = section.querySelector('h2');
        const header = document.querySelector('.header');

        const sectionRect = section.getBoundingClientRect();
        const containerRect = container ? container.getBoundingClientRect() : null;
        const titleDecoratedRect = titleDecorated ? titleDecorated.getBoundingClientRect() : null;
        const h2Rect = h2.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();

        const sectionStyle = window.getComputedStyle(section);
        const containerStyle = container ? window.getComputedStyle(container) : null;
        const titleDecoratedStyle = titleDecorated ? window.getComputedStyle(titleDecorated) : null;
        const h2Style = window.getComputedStyle(h2);

        return {
          section: {
            id: section.id,
            classes: section.className,
            inlineStyle: section.getAttribute('style'),
            position: sectionStyle.position,
            scrollMarginTop: sectionStyle.scrollMarginTop,
            paddingTop: parseFloat(sectionStyle.paddingTop),
            paddingBottom: parseFloat(sectionStyle.paddingBottom),
            marginTop: parseFloat(sectionStyle.marginTop),
            marginBottom: parseFloat(sectionStyle.marginBottom),
            top: Math.round(sectionRect.top),
            height: Math.round(sectionRect.height),
            width: Math.round(sectionRect.width)
          },
          container: containerRect ? {
            paddingTop: parseFloat(containerStyle.paddingTop),
            paddingBottom: parseFloat(containerStyle.paddingBottom),
            top: Math.round(containerRect.top),
            height: Math.round(containerRect.height)
          } : null,
          titleDecorated: titleDecoratedRect ? {
            marginBottom: parseFloat(titleDecoratedStyle.marginBottom),
            top: Math.round(titleDecoratedRect.top),
            height: Math.round(titleDecoratedRect.height)
          } : null,
          h2: {
            fontFamily: h2Style.fontFamily,
            fontSize: h2Style.fontSize,
            lineHeight: h2Style.lineHeight,
            marginTop: parseFloat(h2Style.marginTop),
            marginBottom: parseFloat(h2Style.marginBottom),
            top: Math.round(h2Rect.top),
            height: Math.round(h2Rect.height)
          },
          header: {
            bottom: Math.round(headerRect.bottom),
            height: Math.round(headerRect.height)
          },
          measurements: {
            sectionTopToH2Top: Math.round(h2Rect.top - sectionRect.top),
            headerBottomToH2Top: Math.round(h2Rect.top - headerRect.bottom),
            headerBottomToSectionTop: Math.round(sectionRect.top - headerRect.bottom)
          }
        };
      }, anchor);

      console.log('Section Element:');
      console.log(`  ID: ${anchorData.section.id}`);
      console.log(`  Classes: ${anchorData.section.classes}`);
      console.log(`  Inline Styles: ${anchorData.section.inlineStyle}`);
      console.log(`  Computed Position: ${anchorData.section.position}`);
      console.log(`  Computed scroll-margin-top: ${anchorData.section.scrollMarginTop}`);
      console.log(`  Padding: ${anchorData.section.paddingTop}px top, ${anchorData.section.paddingBottom}px bottom`);
      console.log(`  Margin: ${anchorData.section.marginTop}px top, ${anchorData.section.marginBottom}px bottom`);
      console.log(`  Dimensions: ${anchorData.section.width}px × ${anchorData.section.height}px`);
      console.log(`  Position in Viewport: top=${anchorData.section.top}px`);
      console.log('');

      if (anchorData.container) {
        console.log('Container (.container):');
        console.log(`  Padding: ${anchorData.container.paddingTop}px top, ${anchorData.container.paddingBottom}px bottom`);
        console.log(`  Position in Viewport: top=${anchorData.container.top}px`);
        console.log(`  Height: ${anchorData.container.height}px`);
        console.log('');
      }

      if (anchorData.titleDecorated) {
        console.log('Title Decorated Wrapper (.section-title-decorated):');
        console.log(`  Margin Bottom: ${anchorData.titleDecorated.marginBottom}px`);
        console.log(`  Position in Viewport: top=${anchorData.titleDecorated.top}px`);
        console.log(`  Height: ${anchorData.titleDecorated.height}px`);
        console.log('');
      }

      console.log('H2 Element:');
      console.log(`  Font: ${anchorData.h2.fontFamily}`);
      console.log(`  Font Size: ${anchorData.h2.fontSize}`);
      console.log(`  Line Height: ${anchorData.h2.lineHeight}`);
      console.log(`  Margin: ${anchorData.h2.marginTop}px top, ${anchorData.h2.marginBottom}px bottom`);
      console.log(`  Position in Viewport: top=${anchorData.h2.top}px`);
      console.log(`  Height: ${anchorData.h2.height}px`);
      console.log('');

      console.log('Header at Scroll Position:');
      console.log(`  Bottom Position: ${anchorData.header.bottom}px`);
      console.log(`  Height: ${anchorData.header.height}px`);
      console.log('');

      console.log('━'.repeat(85));
      console.log('CRITICAL MEASUREMENTS:');
      console.log('━'.repeat(85));
      console.log(`  Distance from Section Top → H2 Top: ${anchorData.measurements.sectionTopToH2Top}px`);
      console.log(`  Distance from Header Bottom → H2 Top: ${anchorData.measurements.headerBottomToH2Top}px`);
      console.log(`  Distance from Header Bottom → Section Top: ${anchorData.measurements.headerBottomToSectionTop}px`);
      console.log('');

      // Determine if alignment is correct
      const gap = anchorData.measurements.headerBottomToH2Top;
      let status, recommendation;

      if (gap === 0) {
        status = '✅ PERFECT';
        recommendation = 'No adjustment needed';
      } else if (gap > 0) {
        status = `❌ GAP OF ${gap}px`;
        recommendation = `H2 is ${gap}px too far down. Reduce scroll-margin-top by ${gap}px.`;
      } else {
        status = `❌ OVERLAP OF ${Math.abs(gap)}px`;
        recommendation = `H2 is ${Math.abs(gap)}px too far up (hidden behind header). Increase scroll-margin-top by ${Math.abs(gap)}px.`;
      }

      console.log('STATUS: ' + status);
      console.log('RECOMMENDATION: ' + recommendation);
      console.log('');
      console.log('');
    }
  }

  await browser.close();

  console.log('═'.repeat(100));
  console.log('AUDIT COMPLETE');
  console.log('═'.repeat(100));
}

comprehensiveAudit()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

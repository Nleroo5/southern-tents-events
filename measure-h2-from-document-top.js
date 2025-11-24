/**
 * MEASURE H2 ABSOLUTE POSITION FROM DOCUMENT TOP
 */

const puppeteer = require('puppeteer');

async function measureH2() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667 });

  // Go to page without hash first to get unscrolled measurements
  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  const measurements = await page.evaluate(() => {
    const header = document.querySelector('.header');
    const tents = document.querySelector('#tents');
    const tentsH2 = tents ? tents.querySelector('h2') : null;
    const furniture = document.querySelector('#furniture');
    const furnitureH2 = furniture ? furniture.querySelector('h2') : null;
    const lighting = document.querySelector('#lighting');
    const lightingH2 = lighting ? lighting.querySelector('h2') : null;

    function getAbsoluteTop(element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return rect.top + scrollTop;
    }

    return {
      headerHeight: header.getBoundingClientRect().height,
      tents: {
        sectionTop: getAbsoluteTop(tents),
        h2Top: getAbsoluteTop(tentsH2)
      },
      furniture: {
        sectionTop: getAbsoluteTop(furniture),
        h2Top: getAbsoluteTop(furnitureH2)
      },
      lighting: {
        sectionTop: getAbsoluteTop(lighting),
        h2Top: getAbsoluteTop(lightingH2)
      }
    };
  });

  console.log('═'.repeat(80));
  console.log('H2 ABSOLUTE POSITIONS FROM DOCUMENT TOP (Mobile 375px)');
  console.log('═'.repeat(80));
  console.log('');
  console.log(`Header height: ${Math.round(measurements.headerHeight)}px`);
  console.log('');
  console.log('Tents:');
  console.log(`  Section top: ${Math.round(measurements.tents.sectionTop)}px from document top`);
  console.log(`  H2 top: ${Math.round(measurements.tents.h2Top)}px from document top`);
  console.log(`  Correct scroll = H2 top - header height = ${Math.round(measurements.tents.h2Top - measurements.headerHeight)}px`);
  console.log('');
  console.log('Furniture:');
  console.log(`  Section top: ${Math.round(measurements.furniture.sectionTop)}px from document top`);
  console.log(`  H2 top: ${Math.round(measurements.furniture.h2Top)}px from document top`);
  console.log(`  Correct scroll = H2 top - header height = ${Math.round(measurements.furniture.h2Top - measurements.headerHeight)}px`);
  console.log('');
  console.log('Lighting:');
  console.log(`  Section top: ${Math.round(measurements.lighting.sectionTop)}px from document top`);
  console.log(`  H2 top: ${Math.round(measurements.lighting.h2Top)}px from document top`);
  console.log(`  Correct scroll = H2 top - header height = ${Math.round(measurements.lighting.h2Top - measurements.headerHeight)}px`);
  console.log('');
  console.log('═'.repeat(80));

  await browser.close();
}

measureH2()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

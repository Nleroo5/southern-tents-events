/**
 * CHECK VISUAL STYLING
 */

const puppeteer = require('puppeteer');

async function checkVisual() {
  console.log('🔍 CHECKING VISUAL STYLING\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1024 });

  await page.goto('http://localhost:3000/services.html', {
    waitUntil: 'networkidle0'
  });

  const result = await page.evaluate(() => {
    const header = document.querySelector('.header');
    const tents = document.querySelector('#tents');
    const furniture = document.querySelector('#furniture');
    const lighting = document.querySelector('#lighting');

    const headerStyle = window.getComputedStyle(header);
    const tentsStyle = window.getComputedStyle(tents);
    const furnitureStyle = window.getComputedStyle(furniture);
    const lightingStyle = window.getComputedStyle(lighting);

    return {
      header: {
        position: headerStyle.position,
        backgroundColor: headerStyle.backgroundColor,
        borderBottom: headerStyle.borderBottom
      },
      tents: {
        classes: tents.className,
        position: tentsStyle.position,
        backgroundColor: tentsStyle.backgroundColor,
        backgroundImage: tentsStyle.backgroundImage.substring(0, 100) + '...'
      },
      furniture: {
        classes: furniture.className,
        position: furnitureStyle.position,
        backgroundColor: furnitureStyle.backgroundColor,
        backgroundImage: furnitureStyle.backgroundImage.substring(0, 100) + '...'
      },
      lighting: {
        classes: lighting.className,
        position: lightingStyle.position,
        backgroundColor: lightingStyle.backgroundColor
      }
    };
  });

  console.log('='.repeat(80));
  console.log('HEADER STYLING:');
  console.log('='.repeat(80));
  console.log(`Position: ${result.header.position}`);
  console.log(`Background: ${result.header.backgroundColor}`);
  console.log(`Border: ${result.header.borderBottom}`);

  console.log('\n' + '='.repeat(80));
  console.log('SECTION STYLING:');
  console.log('='.repeat(80));

  console.log(`\n#tents (${result.tents.classes}):`);
  console.log(`  Position: ${result.tents.position}`);
  console.log(`  Background Color: ${result.tents.backgroundColor}`);
  console.log(`  Background Image: ${result.tents.backgroundImage}`);

  console.log(`\n#furniture (${result.furniture.classes}):`);
  console.log(`  Position: ${result.furniture.position}`);
  console.log(`  Background Color: ${result.furniture.backgroundColor}`);
  console.log(`  Background Image: ${result.furniture.backgroundImage}`);

  console.log(`\n#lighting (${result.lighting.classes}):`);
  console.log(`  Position: ${result.lighting.position}`);
  console.log(`  Background Color: ${result.lighting.backgroundColor}`);

  await browser.close();
  console.log('\n' + '='.repeat(80));
  console.log('✅ Visual check complete!\n');
}

checkVisual()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

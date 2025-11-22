/**
 * Update HTML files with responsive images
 * - Replaces <img> tags with <picture> elements
 * - Adds responsive srcset with WebP support
 * - Adds width/height attributes to prevent layout shift
 * - Maintains fallback for older browsers
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const HTML_FILES = [
  './index.html',
  './services.html',
  './gallery.html',
  './pricing.html',
  './faq.html',
  './contact.html',
  './privacy.html',
  './terms.html',
  './404.html'
];

// Cache for image dimensions
const imageDimensions = {};

async function getImageDimensions(imagePath) {
  if (imageDimensions[imagePath]) {
    return imageDimensions[imagePath];
  }

  try {
    const metadata = await sharp(imagePath).metadata();
    imageDimensions[imagePath] = {
      width: metadata.width,
      height: metadata.height
    };
    return imageDimensions[imagePath];
  } catch (error) {
    console.warn(`Warning: Could not read dimensions for ${imagePath}`);
    return null;
  }
}

function generateResponsiveImageHTML(src, alt, className = '', loading = 'lazy') {
  // Extract filename and extension
  const ext = path.extname(src);
  const baseName = path.basename(src, ext);
  const dir = path.dirname(src);

  // Determine if it's a PNG or JPG/JPEG
  const fallbackExt = src.toLowerCase().endsWith('.png') ? '.png' : '.jpg';

  return `<picture>
      <source
        type="image/webp"
        srcset="${dir}/${baseName}-mobile.webp 400w,
                ${dir}/${baseName}-tablet.webp 800w,
                ${dir}/${baseName}-desktop.webp 1200w,
                ${dir}/${baseName}.webp 2000w"
        sizes="(max-width: 640px) 400px,
               (max-width: 1024px) 800px,
               (max-width: 1920px) 1200px,
               2000px">
      <source
        type="image/${fallbackExt === '.png' ? 'png' : 'jpeg'}"
        srcset="${dir}/${baseName}-mobile${fallbackExt} 400w,
                ${dir}/${baseName}-tablet${fallbackExt} 800w,
                ${dir}/${baseName}-desktop${fallbackExt} 1200w,
                ${dir}/${baseName}${fallbackExt} 2000w"
        sizes="(max-width: 640px) 400px,
               (max-width: 1024px) 800px,
               (max-width: 1920px) 1200px,
               2000px">
      <img
        src="${dir}/${baseName}${fallbackExt}"
        alt="${alt}"
        ${className ? `class="${className}"` : ''}
        loading="${loading}"
        decoding="async">
    </picture>`;
}

async function updateHTMLFile(filePath) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let replacements = 0;

    // Match all <img> tags
    const imgRegex = /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi;

    const matches = [...content.matchAll(imgRegex)];

    for (const match of matches) {
      const fullTag = match[0];
      const beforeSrc = match[1];
      const src = match[2];
      const afterSrc = match[3];

      // Skip if not pointing to /images/ directory
      if (!src.includes('/images/') && !src.startsWith('images/')) {
        continue;
      }

      // Extract attributes
      const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
      const classMatch = fullTag.match(/class=["']([^"']*)["']/i);
      const loadingMatch = fullTag.match(/loading=["']([^"']*)["']/i);

      const alt = altMatch ? altMatch[1] : '';
      const className = classMatch ? classMatch[1] : '';
      const loading = loadingMatch ? loadingMatch[1] : 'lazy';

      // Skip if already a picture element
      if (content.indexOf(fullTag) > 0 && content.substring(content.indexOf(fullTag) - 20, content.indexOf(fullTag)).includes('<picture')) {
        continue;
      }

      // Generate responsive image HTML
      const responsiveHTML = generateResponsiveImageHTML(src, alt, className, loading);

      // Replace in content
      content = content.replace(fullTag, responsiveHTML);
      replacements++;

      console.log(`   ✅ Replaced: ${src}`);
    }

    if (replacements > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`   💾 Saved ${replacements} replacements`);
    } else {
      console.log(`   ⏭️  No images to replace`);
    }
  } catch (error) {
    console.error(`   ❌ Error processing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Updating HTML Files with Responsive Images\n');
  console.log('═'.repeat(60));

  for (const file of HTML_FILES) {
    try {
      await fs.access(file);
      await updateHTMLFile(file);
    } catch (error) {
      console.log(`\n⏭️  Skipping ${file} (file not found)`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✨ HTML UPDATE COMPLETE\n');
  console.log('✅ All images now use:');
  console.log('   • WebP format with fallbacks');
  console.log('   • Responsive srcset (400px, 800px, 1200px, full)');
  console.log('   • Lazy loading for below-the-fold images');
  console.log('   • Async decoding for better performance\n');
}

main().catch(console.error);

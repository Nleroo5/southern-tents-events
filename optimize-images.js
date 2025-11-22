/**
 * Professional Image Optimization Script
 * - Converts images to WebP format with fallbacks
 * - Creates responsive sizes (mobile: 400px, tablet: 800px, desktop: 1200px, original)
 * - Compresses with 85% quality
 * - Maintains original formats for browser compatibility
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = './images';
const OPTIMIZED_DIR = './images-optimized';

// Responsive breakpoints
const SIZES = {
  mobile: 400,
  tablet: 800,
  desktop: 1200,
  full: null // Original size
};

const QUALITY = {
  webp: 85,
  jpeg: 85,
  png: 90
};

async function optimizeImage(inputPath, filename) {
  const ext = path.extname(filename).toLowerCase();
  const name = path.basename(filename, ext);

  // Skip non-image files
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`⏭️  Skipping ${filename} (not an image)`);
    return;
  }

  console.log(`\n🔄 Processing: ${filename}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`   Original: ${metadata.width}x${metadata.height} (${metadata.format})`);

    // Process each size
    for (const [sizeName, width] of Object.entries(SIZES)) {
      let resized = image.clone();

      // Resize if width is specified and image is larger
      if (width && metadata.width > width) {
        resized = resized.resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Generate WebP version
      const webpFilename = `${name}${sizeName !== 'full' ? `-${sizeName}` : ''}.webp`;
      await resized
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(OPTIMIZED_DIR, webpFilename));

      // Generate fallback (JPEG or PNG)
      const fallbackExt = ['.png'].includes(ext) ? '.png' : '.jpg';
      const fallbackFilename = `${name}${sizeName !== 'full' ? `-${sizeName}` : ''}${fallbackExt}`;

      if (fallbackExt === '.png') {
        await resized
          .png({ quality: QUALITY.png, compressionLevel: 9 })
          .toFile(path.join(OPTIMIZED_DIR, fallbackFilename));
      } else {
        await resized
          .jpeg({ quality: QUALITY.jpeg, progressive: true })
          .toFile(path.join(OPTIMIZED_DIR, fallbackFilename));
      }

      console.log(`   ✅ ${sizeName}: ${webpFilename} + ${fallbackFilename}`);
    }
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
  }
}

async function getDirSize(dir) {
  const files = await fs.readdir(dir);
  let totalSize = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function main() {
  console.log('🚀 Starting Professional Image Optimization\n');
  console.log('═'.repeat(60));

  // Create optimized directory
  try {
    await fs.access(OPTIMIZED_DIR);
    console.log('📁 Cleaning existing optimized directory...');
    await fs.rm(OPTIMIZED_DIR, { recursive: true });
  } catch (error) {
    // Directory doesn't exist, that's fine
  }

  await fs.mkdir(OPTIMIZED_DIR, { recursive: true });
  console.log('📁 Created optimized directory\n');

  // Get original size
  const originalSize = await getDirSize(IMAGES_DIR);
  console.log(`📊 Original images size: ${formatBytes(originalSize)}\n`);
  console.log('═'.repeat(60));

  // Process all images
  const files = await fs.readdir(IMAGES_DIR);

  for (const file of files) {
    if (file.startsWith('.')) continue; // Skip hidden files

    const inputPath = path.join(IMAGES_DIR, file);
    const stats = await fs.stat(inputPath);

    if (stats.isFile()) {
      await optimizeImage(inputPath, file);
    }
  }

  // Get optimized size
  const optimizedSize = await getDirSize(OPTIMIZED_DIR);
  const savings = originalSize - optimizedSize;
  const savingsPercent = Math.round((savings / originalSize) * 100);

  console.log('\n' + '═'.repeat(60));
  console.log('✨ OPTIMIZATION COMPLETE\n');
  console.log(`📊 Original size:  ${formatBytes(originalSize)}`);
  console.log(`📊 Optimized size: ${formatBytes(optimizedSize)}`);
  console.log(`💾 Space saved:    ${formatBytes(savings)} (${savingsPercent}%)`);
  console.log('═'.repeat(60));
  console.log('\n✅ Next steps:');
  console.log('1. Review optimized images in ./images-optimized/');
  console.log('2. Update HTML to use responsive images with <picture> elements');
  console.log('3. Replace ./images/ with ./images-optimized/ when satisfied\n');
}

main().catch(console.error);

/**
 * Professional Build Script
 * - Combines and minifies JavaScript files
 * - Combines and minifies CSS files
 * - Generates production-ready assets
 */

const fs = require('fs').promises;
const { minify: terserMinify } = require('terser');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// JavaScript bundles
const JS_BUNDLES = {
  'main': {
    files: [
      './js/utils.js',
      './js/components.js',
      './js/main.js'
    ],
    output: './js/bundle.min.js'
  },
  'quote-form': {
    files: ['./js/quote-form.js'],
    output: './js/quote-form.min.js'
  }
};

// CSS files
const CSS_FILES = [
  './css/reset.css',
  './css/fonts.css',
  './css/variables.css',
  './css/components.css',
  './css/main.css'
];

const CSS_OUTPUT = './css/styles.min.css';

async function minifyJSBundle(name, config) {
  console.log(`\n📦 Bundling JavaScript: ${name}`);

  try {
    // Read all files
    const contents = await Promise.all(
      config.files.map(file => fs.readFile(file, 'utf-8'))
    );

    // Concatenate
    const combined = contents.join('\n\n');

    // Minify
    const result = await terserMinify(combined, {
      compress: {
        dead_code: true,
        drop_console: false, // Keep console for now
        drop_debugger: true,
        pure_funcs: ['console.debug']
      },
      mangle: {
        toplevel: false
      },
      format: {
        comments: false
      }
    });

    if (result.error) {
      throw result.error;
    }

    // Write output
    await fs.writeFile(config.output, result.code);

    const originalSize = combined.length;
    const minifiedSize = result.code.length;
    const savings = Math.round(((originalSize - minifiedSize) / originalSize) * 100);

    console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   Minified: ${(minifiedSize / 1024).toFixed(1)} KB`);
    console.log(`   Savings:  ${savings}%`);
    console.log(`   ✅ Created ${config.output}`);

    return { originalSize, minifiedSize };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

async function minifyCSS() {
  console.log(`\n🎨 Bundling and Minifying CSS`);

  try {
    // Read all CSS files
    const contents = await Promise.all(
      CSS_FILES.map(file => fs.readFile(file, 'utf-8'))
    );

    // Concatenate
    const combined = contents.join('\n\n');

    // Write combined file first
    const tempFile = './css/styles-combined.css';
    await fs.writeFile(tempFile, combined);

    // Minify using clean-css-cli
    await execAsync(`npx cleancss -o ${CSS_OUTPUT} ${tempFile}`);

    // Clean up temp file
    await fs.unlink(tempFile);

    // Get file sizes
    const originalSize = combined.length;
    const minifiedContent = await fs.readFile(CSS_OUTPUT, 'utf-8');
    const minifiedSize = minifiedContent.length;
    const savings = Math.round(((originalSize - minifiedSize) / originalSize) * 100);

    console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   Minified: ${(minifiedSize / 1024).toFixed(1)} KB`);
    console.log(`   Savings:  ${savings}%`);
    console.log(`   ✅ Created ${CSS_OUTPUT}`);

    return { originalSize, minifiedSize };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log('🚀 Building Optimized Assets\n');
  console.log('═'.repeat(60));

  let totalJSOriginal = 0;
  let totalJSMinified = 0;
  let totalCSSOriginal = 0;
  let totalCSSMinified = 0;

  // Process JavaScript bundles
  for (const [name, config] of Object.entries(JS_BUNDLES)) {
    const result = await minifyJSBundle(name, config);
    totalJSOriginal += result.originalSize;
    totalJSMinified += result.minifiedSize;
  }

  // Process CSS
  const cssResult = await minifyCSS();
  totalCSSOriginal += cssResult.originalSize;
  totalCSSMinified += cssResult.minifiedSize;

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('✨ BUILD COMPLETE\n');

  console.log('📊 JavaScript:');
  console.log(`   Original: ${(totalJSOriginal / 1024).toFixed(1)} KB`);
  console.log(`   Minified: ${(totalJSMinified / 1024).toFixed(1)} KB`);
  console.log(`   Savings:  ${Math.round(((totalJSOriginal - totalJSMinified) / totalJSOriginal) * 100)}%\n`);

  console.log('📊 CSS:');
  console.log(`   Original: ${(totalCSSOriginal / 1024).toFixed(1)} KB`);
  console.log(`   Minified: ${(totalCSSMinified / 1024).toFixed(1)} KB`);
  console.log(`   Savings:  ${Math.round(((totalCSSOriginal - totalCSSMinified) / totalCSSOriginal) * 100)}%\n`);

  console.log('📊 Total:');
  const totalOriginal = totalJSOriginal + totalCSSOriginal;
  const totalMinified = totalJSMinified + totalCSSMinified;
  console.log(`   Original: ${(totalOriginal / 1024).toFixed(1)} KB`);
  console.log(`   Minified: ${(totalMinified / 1024).toFixed(1)} KB`);
  console.log(`   Savings:  ${Math.round(((totalOriginal - totalMinified) / totalOriginal) * 100)}%\n`);

  console.log('═'.repeat(60));
  console.log('\n✅ Next step: Update HTML files to use minified assets\n');
}

main().catch(console.error);

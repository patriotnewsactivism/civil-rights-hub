const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the sizes we need to generate
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

const sourceFile = path.join(__dirname, '../public/favicon.ico');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  console.log('Starting favicon generation...\n');

  for (const { name, size } of sizes) {
    const outputPath = path.join(outputDir, name);

    try {
      await sharp(sourceFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\nFavicon generation complete!');
}

generateFavicons().catch(console.error);

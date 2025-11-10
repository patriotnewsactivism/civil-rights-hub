const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '../public/wtpn-logo.png');
const outputDir = path.join(__dirname, '../public');

async function createOGImage() {
  console.log('Starting Open Graph image generation...\n');

  // Create a 1200x630 canvas with gradient background
  const width = 1200;
  const height = 630;

  // Create SVG with gradient background, logo, and text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1f2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2d3748;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#grad)"/>

      <!-- Decorative pattern -->
      <pattern id="pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect x="16" y="16" width="20" height="20" fill="#ffffff" opacity="0.03"/>
      </pattern>
      <rect width="${width}" height="${height}" fill="url(#pattern)"/>

      <!-- Title -->
      <text x="${width / 2}" y="420"
            font-family="Arial, sans-serif"
            font-size="72"
            font-weight="bold"
            fill="#ffffff"
            text-anchor="middle">
        Civil Rights Hub
      </text>

      <!-- Subtitle -->
      <text x="${width / 2}" y="490"
            font-family="Arial, sans-serif"
            font-size="32"
            fill="#e2e8f0"
            text-anchor="middle">
        Know Your Rights. Protect Your Freedom.
      </text>

      <!-- Bottom text -->
      <text x="${width / 2}" y="560"
            font-family="Arial, sans-serif"
            font-size="24"
            fill="#94a3b8"
            text-anchor="middle">
        Comprehensive Civil Rights Information &amp; Legal Resources
      </text>
    </svg>
  `;

  try {
    // Load and resize the logo
    const logoBuffer = await sharp(logoPath)
      .resize(300, 300, { fit: 'inside' })
      .toBuffer();

    // Create the base image from SVG
    const baseImage = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    // Composite the logo onto the background
    const finalImage = await sharp(baseImage)
      .composite([
        {
          input: logoBuffer,
          top: 60,
          left: Math.floor((width - 300) / 2),
        }
      ])
      .png()
      .toBuffer();

    // Save as og-image.png
    await sharp(finalImage).toFile(path.join(outputDir, 'og-image.png'));
    console.log('✓ Generated og-image.png (1200x630)');

    // Save as twitter-image.png (same image)
    await sharp(finalImage).toFile(path.join(outputDir, 'twitter-image.png'));
    console.log('✓ Generated twitter-image.png (1200x630)');

    // Also save as logo.png (referenced in structured data)
    const logoCopy = await sharp(logoPath)
      .resize(512, 512, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'logo.png'));
    console.log('✓ Generated logo.png (512x512)');

  } catch (error) {
    console.error('✗ Failed to generate OG images:', error.message);
    process.exit(1);
  }

  console.log('\nOpen Graph image generation complete!');
  console.log('Images are ready for social media sharing.');
}

createOGImage().catch(console.error);

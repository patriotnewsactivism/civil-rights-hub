import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTH = 1200;
const HEIGHT = 630;

// Create gradient background SVG (just the background, no images)
const createBackgroundSvg = () => `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)"/>

  <!-- Pattern overlay -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#000" opacity="0.1"/>
</svg>
`;

// Create text overlay SVG
const createTextSvg = () => `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Text -->
  <text x="${WIDTH/2}" y="535"
        font-family="Inter, Arial, sans-serif"
        font-size="72"
        font-weight="bold"
        fill="#ffffff"
        text-anchor="middle">
    Civil Rights Hub
  </text>

  <!-- Subtitle -->
  <text x="${WIDTH/2}" y="590"
        font-family="Inter, Arial, sans-serif"
        font-size="32"
        font-weight="400"
        fill="#e0e7ff"
        text-anchor="middle">
    Know Your Rights. Protect Your Freedom.
  </text>
</svg>
`;

async function generateOgImage() {
  try {
    // Read the WTPN logo
    const logoPath = path.join(__dirname, '../public/wtpn-logo.png');

    // Create background
    const backgroundBuffer = Buffer.from(createBackgroundSvg());

    // Resize logo for large display (top center)
    const largeLogo = await sharp(logoPath)
      .resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // Resize logo for small display (above text)
    const smallLogo = await sharp(logoPath)
      .resize(80, 80, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // Create text layer
    const textBuffer = Buffer.from(createTextSvg());

    // Composite all layers
    const finalImage = await sharp(backgroundBuffer)
      .composite([
        {
          input: largeLogo,
          top: 120,
          left: Math.floor(WIDTH/2 - 150)
        },
        {
          input: smallLogo,
          top: 420,
          left: Math.floor(WIDTH/2 - 40)
        },
        {
          input: textBuffer,
          top: 0,
          left: 0
        }
      ])
      .png()
      .toBuffer();

    // Generate og-image.png
    const outputDir = path.join(__dirname, '../public');
    await sharp(finalImage)
      .toFile(path.join(outputDir, 'og-image.png'));

    console.log('✓ Generated og-image.png (1200x630)');

    // Generate twitter-image.png (same as og-image)
    await sharp(finalImage)
      .toFile(path.join(outputDir, 'twitter-image.png'));

    console.log('✓ Generated twitter-image.png (1200x630)');

    // Also create logo.png (referenced in structured data)
    await sharp(logoPath)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'logo.png'));

    console.log('✓ Generated logo.png (512x512)');

    console.log('\n✓ All social share images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

generateOgImage();

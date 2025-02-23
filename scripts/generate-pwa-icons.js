const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');
const SOURCE_ICON = path.join(process.cwd(), 'public', 'logo.png');

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Define icon sizes
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a default SVG logo if no logo exists
async function createDefaultLogo() {
  const svgContent = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#4F46E5"/>
      <path d="M256 128C256 128 384 192 384 256C384 320 256 384 256 384C256 384 128 320 128 256C128 192 256 128 256 128Z" fill="white"/>
      <circle cx="256" cy="256" r="64" fill="#4F46E5"/>
    </svg>
  `;

  // Convert SVG to PNG using sharp
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(SOURCE_ICON);

  console.log('Created default logo.png');
}

async function generateIcons() {
  try {
    // Create default logo if it doesn't exist
    if (!fs.existsSync(SOURCE_ICON)) {
      await createDefaultLogo();
    }

    // Generate icons for each size
    for (const size of ICON_SIZES) {
      const iconPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
      
      await sharp(SOURCE_ICON)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(iconPath);
      
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate favicon.ico
    await sharp(SOURCE_ICON)
      .resize(32, 32)
      .toFile(path.join(process.cwd(), 'public', 'favicon.ico'));
    
    console.log('Generated favicon.ico');

    // Generate Apple Touch Icon
    await sharp(SOURCE_ICON)
      .resize(180, 180)
      .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));
    
    console.log('Generated apple-touch-icon.png');

    // Generate 16x16 and 32x32 icons
    await sharp(SOURCE_ICON)
      .resize(16, 16)
      .toFile(path.join(ICONS_DIR, 'icon-16x16.png'));
    
    await sharp(SOURCE_ICON)
      .resize(32, 32)
      .toFile(path.join(ICONS_DIR, 'icon-32x32.png'));

    console.log('\nAll icons generated successfully!');
    console.log('\nMake sure to place these meta tags in your HTML head:');
    console.log(`
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
<link rel="manifest" href="/manifest.json">
    `);

  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 
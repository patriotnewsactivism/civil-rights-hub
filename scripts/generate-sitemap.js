/**
 * Sitemap Generator for Civil Rights Hub
 *
 * Generates sitemap.xml with all pages, sections, and dynamic content
 * Run with: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://civilrightshub.org';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Format date to W3C Datetime format (ISO 8601)
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const today = formatDate(new Date());

// Define all URLs with their properties
const urls = [
  // Main Pages
  {
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    loc: `${BASE_URL}/community`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: `${BASE_URL}/auth`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.5'
  },

  // Key Sections (Anchor Links)
  {
    loc: `${BASE_URL}/#rights`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    loc: `${BASE_URL}/#incident-guide`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    loc: `${BASE_URL}/#report`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: `${BASE_URL}/#feed`,
    lastmod: today,
    changefreq: 'hourly',
    priority: '0.8'
  },
  {
    loc: `${BASE_URL}/#map`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    loc: `${BASE_URL}/#states`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    loc: `${BASE_URL}/#scanners`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7'
  },
  {
    loc: `${BASE_URL}/#lawyers`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    loc: `${BASE_URL}/#activists`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    loc: `${BASE_URL}/#accountability`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    loc: `${BASE_URL}/#foia`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    loc: `${BASE_URL}/#foia-tracker`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7'
  },
  {
    loc: `${BASE_URL}/#legislative`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    loc: `${BASE_URL}/#case-search`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    loc: `${BASE_URL}/#ai-tools`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    loc: `${BASE_URL}/#resources`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8'
  },
];

// Add top states
const topStates = [
  'California', 'Texas', 'Florida', 'New York', 'Pennsylvania',
  'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
  'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts',
  'Tennessee', 'Indiana', 'Missouri', 'Maryland', 'Wisconsin',
  'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana',
  'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah',
  'Iowa', 'Nevada', 'Arkansas', 'Mississippi', 'Kansas',
  'New Mexico', 'Nebraska', 'West Virginia', 'Idaho', 'Hawaii',
  'New Hampshire', 'Maine', 'Montana', 'Rhode Island', 'Delaware',
  'South Dakota', 'North Dakota', 'Alaska', 'Vermont', 'Wyoming'
];

topStates.forEach(state => {
  urls.push({
    loc: `${BASE_URL}/#states?state=${encodeURIComponent(state)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.7'
  });
});

// Add topic-specific URLs
const topics = [
  { name: 'first-amendment', priority: '0.7' },
  { name: 'fourth-amendment', priority: '0.7' },
  { name: 'fifth-amendment', priority: '0.7' },
  { name: 'recording', priority: '0.8' }
];

topics.forEach(topic => {
  urls.push({
    loc: `${BASE_URL}/#rights/${topic.name}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: topic.priority
  });
});

// Generate XML sitemap
const generateSitemap = () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n\n';
  });

  xml += '</urlset>\n';

  return xml;
};

// Write sitemap to file
const sitemap = generateSitemap();
fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');

console.log('✅ Sitemap generated successfully!');
console.log(`📝 Total URLs: ${urls.length}`);
console.log(`📍 Location: ${OUTPUT_PATH}`);
console.log(`🌐 Submit to:`);
console.log('   - Google: https://search.google.com/search-console');
console.log('   - Bing: https://www.bing.com/webmasters');
console.log('   - Direct URL: https://civilrightshub.org/sitemap.xml');

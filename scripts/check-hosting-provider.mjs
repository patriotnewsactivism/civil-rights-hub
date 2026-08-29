import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const violations = [];

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const netlifyPath = path.join(root, 'netlify.toml');
if (!fs.existsSync(netlifyPath)) {
  violations.push('netlify.toml is required');
} else {
  const netlify = read('netlify.toml');
  if (!/publish\s*=\s*"dist"/.test(netlify)) violations.push('Netlify publish directory must be dist');
  if (!/command\s*=\s*"npm run build"/.test(netlify)) violations.push('Netlify build command must be npm run build');
  if (!/from\s*=\s*"\/\*"[\s\S]*to\s*=\s*"\/index\.html"[\s\S]*status\s*=\s*200/.test(netlify)) {
    violations.push('Netlify SPA fallback rewrite is required');
  }
}

const forbiddenPatterns = [
  /@vercel\//i,
  /\bvercel\s+(deploy|build|pull|link|rollback|promote)\b/i,
  /api\.vercel\.com/i,
  /VERCEL_(PROJECT|ORG|TOKEN|ACCESS_TOKEN|SCOPE)/i,
];

const scanFile = (file) => {
  if (!fs.existsSync(path.join(root, file))) return;
  const content = read(file);
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) violations.push(`${file}: contains prohibited Vercel deployment/runtime reference (${pattern})`);
  }
};

scanFile('package.json');

const workflowsDir = path.join(root, '.github', 'workflows');
if (fs.existsSync(workflowsDir)) {
  for (const entry of fs.readdirSync(workflowsDir)) {
    if (!entry.endsWith('.yml') && !entry.endsWith('.yaml')) continue;
    if (/vercel/i.test(entry)) violations.push(`.github/workflows/${entry}: Vercel workflow files are prohibited`);
    scanFile(path.join('.github', 'workflows', entry));
  }
}

const srcDir = path.join(root, 'src');
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      const rel = path.relative(root, full);
      scanFile(rel);
    }
  }
};
walk(srcDir);

if (violations.length) {
  console.error('Hosting policy check failed:');
  for (const violation of violations) console.error(` - ${violation}`);
  process.exit(1);
}

console.log('Hosting policy check passed: Netlify is the canonical frontend host.');

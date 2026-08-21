import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const required = [
  'astro.config.mjs',
  '.github/workflows/deploy.yml',
  'public/favicon.svg',
  'public/images/latency-lab-hero.webp',
  'src/pages/index.astro',
  'src/pages/404.astro',
  'src/pages/robots.txt.ts',
  'src/pages/sitemap.xml.ts',
  'src/pages/tools/network-test-record.astro',
];

const failures = [];
for (const file of required) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing required file: ${file}`);
}

if (existsSync(resolve(root, 'public/CNAME'))) failures.push('public/CNAME must not exist before DNS is configured.');

const articles = readFileSync(resolve(root, 'src/data/articles.ts'), 'utf8');
const slugs = [...articles.matchAll(/\n\s+slug: '([^']+)'/g)].map((match) => match[1]);
if (slugs.length !== 6) failures.push(`Expected 6 launch articles, found ${slugs.length}.`);
if (new Set(slugs).size !== slugs.length) failures.push('Article slugs are not unique.');

const baseLayout = readFileSync(resolve(root, 'src/layouts/BaseLayout.astro'), 'utf8');
for (const marker of ['rel="canonical"', 'og:title', 'application/ld+json', 'meta name="description"']) {
  if (!baseLayout.includes(marker)) failures.push(`Missing SEO marker: ${marker}`);
}

const heroBytes = statSync(resolve(root, 'public/images/latency-lab-hero.webp')).size;
if (heroBytes > 600_000) failures.push(`Hero WebP is too large: ${heroBytes} bytes.`);
const socialImageBytes = statSync(resolve(root, 'public/images/latency-lab-hero.png')).size;
if (socialImageBytes > 1_000_000) failures.push(`Social image PNG is too large: ${socialImageBytes} bytes.`);

const sourceFiles = [
  'src/components/Header.astro',
  'src/components/Footer.astro',
  'src/layouts/ArticleLayout.astro',
  'src/pages/index.astro',
].map((file) => readFileSync(resolve(root, file), 'utf8')).join('\n');
if (/href=["']\//.test(sourceFiles)) failures.push('Found an internal root-relative href that bypasses base-path handling.');

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${required.length} required assets, ${slugs.length} launch articles, SEO markers, base-path links, and image sizes.`);

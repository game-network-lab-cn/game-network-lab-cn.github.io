import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, process.argv[2] ?? 'dist');
const site = 'https://game-network-lab-cn.github.io';
const errors = [];
const requiredPages = ['/', '/metrics/', '/diagnose/', '/cases/', '/tools/network-analyzer/', '/tools/network-test-record/', '/about/', '/privacy/', '/methodology/', '/editorial-policy/'];
const source = readFileSync(join(root,'src/data/articles.ts'),'utf8');
const articleMatches = [...source.matchAll(/\n\s*slug:\s*'([^']+)',\s*section:\s*'(metrics|diagnose)'/g)];
if(articleMatches.length===0) errors.push('No article routes detected for output verification.');
requiredPages.push(...articleMatches.map(([,slug,section])=>`/${section}/${slug}/`));
const pathFor = path => join(dist, path === '/' ? 'index.html' : `${path.replace(/^\//,'')}index.html`);
if(!existsSync(dist)) errors.push(`Missing build output: ${dist}`);
const hrefs=[];
for (const path of requiredPages) {
  const file=pathFor(path);
  if(!existsSync(file)) { errors.push(`Missing HTML route ${path}`); continue; }
  const html=readFileSync(file,'utf8');
  if(!/<html\b[^>]*lang=["']zh-CN["']/i.test(html)) errors.push(`${path}: missing zh-CN html lang`);
  if(!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${path}: missing title`);
  if(!/<meta\s+name=["']description["']/i.test(html) && !/<meta\s+[^>]*name=["']description["']/i.test(html)) errors.push(`${path}: missing description`);
  const canon=html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  const expected=site+path;
  if(!canon || !canon.includes(`href="${expected}"`)) errors.push(`${path}: canonical mismatch (expected ${expected})`);
  const mains=(html.match(/<main\b/gi)||[]).length;
  if(mains!==1) errors.push(`${path}: expected exactly one main, found ${mains}`);
  if(path!=='/tools/network-test-record/' && /<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html)) errors.push(`${path}: unexpected noindex`);
  for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    try {const url=new URL(match[1], expected);if(url.origin===site)hrefs.push({from:path,to:url.pathname});} catch { errors.push(`${path}: invalid href ${match[1]}`); }
  }
}
for(const {from,to} of hrefs) {
  if(to.startsWith('/images/') || to.startsWith('/_astro/') || to.startsWith('/assets/'))continue;
  if(!existsSync(pathFor(to)) && !existsSync(join(dist,to.replace(/^\//,'')))) errors.push(`${from}: broken local link to ${to}`);
}
const sitemapFile=join(dist,'sitemap.xml');
if (!existsSync(sitemapFile)) errors.push('Missing sitemap.xml');
else {
  const sitemap=readFileSync(sitemapFile,'utf8');
  for (const path of requiredPages.filter(x=>x!=='/tools/network-test-record/')) if(!sitemap.includes(`<loc>${site+path}</loc>`)) errors.push(`Sitemap missing ${path}`);
  if(sitemap.includes('/tools/network-test-record/')) errors.push('Noindex tool unexpectedly appears in sitemap.');
}
for(const filename of ['robots.txt','llms.txt','404.html']) if(!existsSync(join(dist,filename)))errors.push(`Missing ${filename}`);
if(errors.length){console.error(`Build audit FAILED (${errors.length}):\n${errors.map(x=>' - '+x).join('\n')}`);process.exit(1);}
console.log(`Build audit passed: ${requiredPages.length} routes, ${hrefs.length} internal links, canonical, sitemap, page landmarks and metadata.`);

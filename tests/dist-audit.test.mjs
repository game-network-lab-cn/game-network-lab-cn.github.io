import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('production build pipeline includes post-build HTML audit',()=>{
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url)));
 assert.match(pkg.scripts.build,/astro build && npm run audit:dist/);
 const source=readFileSync(new URL('../scripts/audit-dist.mjs',import.meta.url),'utf8');
 for(const token of ['canonical mismatch','broken local link','Sitemap missing','exactly one main','unexpected noindex']) assert.ok(source.includes(token),token);
});

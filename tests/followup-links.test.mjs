import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../src/pages/tools/network-analyzer.astro', import.meta.url),'utf8');
const content=readFileSync(new URL('../src/data/articles.ts', import.meta.url),'utf8');
test('all analyzer follow-up guides exist in article registry',()=>{
 const paths=[...page.matchAll(/guides\.push\(\['\/diagnose\/([^/]+)\//g)].map(x=>x[1]);
 paths.push('game-lag-diagnostic-tree');
 for(const slug of paths)assert.ok(content.includes(`slug: '${slug}'`),`Missing article: ${slug}`);
});
test('related guides are created as text-only links, not injected HTML',()=>{
 assert.match(page,/id="an-related"/);
 assert.match(page,/a\.textContent=label/);
 assert.match(page,/related\.replaceChildren\(\)/);
});

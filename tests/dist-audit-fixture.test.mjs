import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/data/articles.ts',import.meta.url),'utf8');
const articleMatches=[...source.matchAll(/\n\s*slug:\s*'([^']+)',\s*section:\s*'(metrics|diagnose)'/g)];
const paths=['/','/metrics/','/diagnose/','/cases/','/tools/network-analyzer/','/tools/network-test-record/','/about/','/privacy/','/methodology/','/editorial-policy/',...articleMatches.map(([,slug,section])=>`/${section}/${slug}/`)];
const site='https://game-network-lab-cn.github.io';
function makeFixture(dir, broken=false){
 for(const path of paths){
  const dest=join(dir,path==='/'?'index.html':path.slice(1)+'index.html');
  mkdirSync(dirname(dest),{recursive:true});
  const link=path==='/'?(broken?'/missing-page/':'/diagnose/'):'/';
  writeFileSync(dest,`<html lang="zh-CN"><head><title>Page</title><meta name="description" content="Useful page"><link rel="canonical" href="${site+path}"></head><body><main><a href="${link}">Next</a></main></body></html>`);
 }
 writeFileSync(join(dir,'sitemap.xml'),`<urlset>${paths.filter(x=>x!=='/tools/network-test-record/').map(x=>`<loc>${site+x}</loc>`).join('')}</urlset>`);
 for(const name of ['robots.txt','llms.txt','404.html'])writeFileSync(join(dir,name),'ok');
}
test('post-build audit accepts complete output and rejects broken internal links',()=>{
 const dir=mkdtempSync(join(tmpdir(),'game-site-audit-'));
 try{
  makeFixture(dir);
  const cmd=new URL('../scripts/audit-dist.mjs',import.meta.url).pathname;
  let result=spawnSync(process.execPath,[cmd,dir],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  makeFixture(dir,true);
  result=spawnSync(process.execPath,[cmd,dir],{encoding:'utf8'});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/broken local link/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

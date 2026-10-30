import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page=readFileSync(new URL('../src/pages/tools/network-analyzer.astro',import.meta.url),'utf8');
test('file selection invalidates displayed results before the asynchronous read',()=>{
  assert.match(page, /el\('an-file'\)\.addEventListener\('change', async \(\) => \{\s*const version = \+\+fileReadVersion;\s*invalidate\(\)/);
  assert.match(page, /if\(version!==fileReadVersion\)return/);
});
test('deployment verifies tests before production build',()=>{
  const workflow=readFileSync(new URL('../.github/workflows/deploy.yml',import.meta.url),'utf8');
  assert.match(workflow,/Run automated parser and workflow tests\s+run: npm test[\s\S]*?Check and build site\s+run: npm run build/);
});

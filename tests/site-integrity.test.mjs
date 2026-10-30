import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('homepage symptom choices link to the most relevant diagnosis pages', () => {
  const page = read('../src/pages/index.astro');
  const choices = [
    ['Ping 突然升高', '/diagnose/ping-spikes-while-gaming/'],
    ['只在 Wi-Fi 卡', '/diagnose/wifi-gaming-lag/'],
    ['低 Ping 仍然卡', '/diagnose/low-ping-but-lag/'],
  ];
  for (const [label, path] of choices) {
    const start = page.indexOf(`label: '${label}'`);
    assert.notEqual(start, -1, `Missing choice ${label}`);
    const end = page.indexOf('\n  },', start);
    assert.match(page.slice(start, end), new RegExp(`href: '${path.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}'`));
  }
});

test('analyzer does not infer outage duration from user-supplied interval', () => {
  const page = read('../src/pages/tools/network-analyzer.astro');
  assert.doesNotMatch(page, /最长连续.*跨越约.*发送时间跨度/);
  assert.match(page, /不能由此推算真实断线时长/);
  assert.match(page, /横轴为样本序号，不代表实际时间/);
});

test('article pages use article Open Graph type and llms index covers key routes', () => {
  assert.match(read('../src/layouts/ArticleLayout.astro'), /socialType="article"/);
  assert.match(read('../src/layouts/BaseLayout.astro'), /content=\{socialType\}/);
  const index = read('../src/pages/llms.txt.ts');
  for (const route of ['/diagnose/wifi-gaming-lag/', '/diagnose/ping-spikes-while-gaming/', '/tools/network-analyzer/', '/cases/']) {
    assert.ok(index.includes(route), `Missing ${route}`);
  }
});

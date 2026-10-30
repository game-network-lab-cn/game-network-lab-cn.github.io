import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
test('advertising limited to homepage and diagnostic articles', () => {
  const home = read('../src/pages/index.astro');
  const article = read('../src/layouts/ArticleLayout.astro');
  assert.match(home, /ReferralBanner placement="home"/);
  assert.match(article, /article.section === 'diagnose'/);
  assert.doesNotMatch(article, /<ReferralBanner \/>/);
});
test('view counting is visibility based, explicitly labeled and sponsored', () => {
  const banner = read('../src/components/ReferralBanner.astro');
  assert.match(banner, /IntersectionObserver/);
  assert.match(banner, /ratio >= 0\.5/);
  assert.match(banner, /}, 1000\)/);
  assert.match(banner, /referral_banner_view/);
  assert.match(banner, /rel="sponsored noopener noreferrer"/);
  assert.match(banner, /广告 · 优途加速器/);
  assert.doesNotMatch(banner, /优途官网/);
});

test('ad impression pauses when tab hidden and does not claim delivery', () => {
  const banner = read('../src/components/ReferralBanner.astro');
  assert.match(banner, /document\.visibilityState === 'visible'/);
  assert.match(banner, /visibilitychange/);
  assert.match(banner, /clearViewTimer\(\)/);
  assert.match(banner, /if \(!isVisible\(\) \|\| viewQualified\) return/);
  assert.match(banner, /viewSent = true/);
  assert.match(banner, /attempts >= 10/);
  assert.match(banner, /event queued, not evidence of GA4 receipt/);
});

test('privacy policy explains ad view and click events without uploading logs', () => {
  const privacy = read('../src/pages/privacy.astro');
  assert.match(privacy, /广告与点击统计/);
  assert.match(privacy, /不会附带你输入的 Ping 日志/);
});

import { defineConfig } from 'astro/config';

const customOrigin = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '');

export default defineConfig({
  site: customOrigin || 'https://game-network-lab-cn.github.io',
  base: customOrigin ? '/' : '/game-network-lab',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://game-network-lab-cn.github.io',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
});

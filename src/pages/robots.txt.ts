import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/^\//, '').replace(/\/$/, '');
  const sitemap = new URL(`${base ? `${base}/` : ''}sitemap.xml`, site || 'https://game-network-lab-cn.github.io').href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

import type { APIRoute } from 'astro';
import { indexedRoutes } from '../data/routes';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/^\//, '').replace(/\/$/, '');
  const origin = site || new URL('https://game-network-lab-cn.github.io');
  const entries = indexedRoutes.map((route) => {
    const path = `${base ? `${base}/` : ''}${route.replace(/^\//, '')}`;
    const loc = new URL(path, origin).href;
    return `<url><loc>${loc}</loc><lastmod>2026-08-21</lastmod></url>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

import { articles } from './articles';

export const indexedRoutes = [
  '/',
  '/about/',
  '/methodology/',
  '/editorial-policy/',
  '/privacy/',
  ...articles.map((article) => `/${article.section}/${article.slug}/`),
];

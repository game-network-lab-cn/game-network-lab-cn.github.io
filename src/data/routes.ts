import { articles } from './articles';

export type IndexedRoute = {
  path: string;
  lastModified: string;
};

const staticRoutes: IndexedRoute[] = [
  {
    path: '/',
    lastModified: '2026-08-21',
  },
  {
    path: '/about/',
    lastModified: '2026-08-21',
  },
  {
    path: '/methodology/',
    lastModified: '2026-08-21',
  },
  {
    path: '/editorial-policy/',
    lastModified: '2026-08-21',
  },
  {
    path: '/privacy/',
    lastModified: '2026-08-21',
  },
];

const articleRoutes: IndexedRoute[] = articles.map(
  (article) => ({
    path: `/${article.section}/${article.slug}/`,
    lastModified: article.updatedDate,
  }),
);

export const indexedRoutes: IndexedRoute[] = [
  ...staticRoutes,
  ...articleRoutes,
];

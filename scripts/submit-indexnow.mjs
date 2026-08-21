const origin = 'https://game-network-lab-cn.github.io';
const sitemapUrl = `${origin}/sitemap.xml`;
const key = '9c4a1e7d52b8462fb5b03d9a871c6e42';

let sitemapResponse;

for (let attempt = 1; attempt <= 5; attempt += 1) {
  sitemapResponse = await fetch(sitemapUrl);

  if (sitemapResponse.ok) break;

  if (attempt < 5) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

if (!sitemapResponse?.ok) {
  throw new Error(
    `Unable to read deployed sitemap: ${sitemapResponse?.status || 'network error'}`
  );
}

const sitemap = await sitemapResponse.text();

const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1]
);

if (urlList.length === 0) {
  throw new Error('No indexed URLs found in sitemap.');
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify({
    host: new URL(origin).host,
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList,
  }),
});

if (!response.ok && response.status !== 202) {
  throw new Error(
    `IndexNow returned ${response.status}: ${await response.text()}`
  );
}

console.log(
  `Submitted ${urlList.length} URLs to IndexNow (${response.status}).`
);

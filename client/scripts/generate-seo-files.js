import fs from 'fs';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const SITE_URL = 'https://fitofarm2024.ge';
const API_BASE_URL = 'https://fitofarm-2024.onrender.com';
const ROBOTS_POLICY = 'index, follow';

const STATIC_ROUTES = [
  { url: '/', changefreq: 'weekly' },
  { url: '/about', changefreq: 'monthly' },
  { url: '/products', changefreq: 'weekly' },
  { url: '/contact', changefreq: 'yearly' },
  { url: '/privacy-policy', changefreq: 'yearly' },
  { url: '/terms', changefreq: 'yearly' },
];

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const { data } = await res.json();
    return data || [];
  } catch (err) {
    console.warn('Sitemap: could not fetch products, skipping product URLs —', err.message);
    return [];
  }
}

async function generateSitemap(products) {
  const links = [
    ...STATIC_ROUTES,
    ...products.map((p) => ({
      url: `/products/${p._id}`,
      lastmod: p.updatedAt,
      changefreq: 'monthly',
    })),
  ];

  const stream = new SitemapStream({ hostname: SITE_URL });
  const xml = await streamToPromise(Readable.from(links).pipe(stream));

  fs.writeFileSync(path.resolve('public/sitemap.xml'), xml.toString());
  console.log(`sitemap.xml written with ${links.length} URLs`);
}

function generateRobotsTxt() {
  const isBlocking = ROBOTS_POLICY.startsWith('noindex');
  const content = `User-agent: *\n${isBlocking ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  fs.writeFileSync(path.resolve('public/robots.txt'), content);
  console.log(`robots.txt written (policy: ${ROBOTS_POLICY})`);
}

const products = await fetchProducts();
await generateSitemap(products);
generateRobotsTxt();

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const NON_INDEXABLE_PATHS = new Set(['/404', '/search']);

export default defineConfig({
  site: 'https://rose-lab.com',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    sitemap({
      // Sitemap 只保留希望被 Google 收錄的 canonical URL。
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        return !NON_INDEXABLE_PATHS.has(pathname);
      },
    }),
  ],
  redirects: {
    '/blog/tutorjr-10-lessons/': '/blog/tutorjr-10-lessons-parent-review/',
    '/category/家庭陪學/': '/category/親子共學/',
    '/category/家庭選擇/': '/category/學習規劃/',
    '/category/幼兒英文/': '/tag/幼兒英文/',
    '/category/免費資源/': '/category/免費英文資源/',
  },
});

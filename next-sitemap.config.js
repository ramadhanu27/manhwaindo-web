/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://manhwaindo.web.id',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/admin'],
      },
    ],
    additionalSitemaps: [],
  },
  exclude: ['/admin', '/api', '/404', '/500'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 50000,
  generateIndexSitemap: true,
};

module.exports = config;

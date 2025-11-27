import { getPopular, getLastUpdate } from './api';

export async function generateSitemapUrls() {
  try {
    const [popularData, lastUpdateData] = await Promise.all([
      getPopular(),
      getLastUpdate(1),
    ]);

    const urls: Array<{
      url: string;
      changefreq: string;
      priority: number;
      lastmod?: string;
    }> = [
      {
        url: 'https://manhwaindo.web.id',
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        url: 'https://manhwaindo.web.id/series',
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://manhwaindo.web.id/download',
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        url: 'https://manhwaindo.web.id/bookmark',
        changefreq: 'weekly',
        priority: 0.7,
      },
      {
        url: 'https://manhwaindo.web.id/history',
        changefreq: 'weekly',
        priority: 0.7,
      },
    ];

    // Add popular series
    if (popularData.success && popularData.data) {
      popularData.data.forEach((series: any) => {
        urls.push({
          url: `https://manhwaindo.web.id/series/${series.slug}`,
          changefreq: 'daily',
          priority: 0.8,
        });
      });
    }

    // Add recently updated series
    if (lastUpdateData.success && lastUpdateData.data) {
      lastUpdateData.data.forEach((series: any) => {
        urls.push({
          url: `https://manhwaindo.web.id/series/${series.slug}`,
          changefreq: 'daily',
          priority: 0.8,
        });
      });
    }

    return urls;
  } catch (error) {
    console.error('Error generating sitemap URLs:', error);
    return [];
  }
}

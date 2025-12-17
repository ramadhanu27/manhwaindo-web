import { MetadataRoute } from "next";

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  // Generate params for 256 sitemap files
  const params = [];
  for (let i = 1; i <= 256; i++) {
    params.push({ id: i.toString() });
  }
  return params;
}

export default async function sitemap({ params }: Props): Promise<MetadataRoute.Sitemap> {
  const { id } = params;
  const sitemapNumber = parseInt(id);
  const baseUrl = "https://manhwaindo.web.id";
  const currentDate = new Date();

  const urls: MetadataRoute.Sitemap = [];

  try {
    const API_BASE_URL = "https://rdapi.vercel.app";

    // Each sitemap file handles specific pages
    // Sitemap 1: Static pages + first batch of series
    // Sitemap 2-256: Series and chapters

    if (sitemapNumber === 1) {
      // Add static pages to first sitemap
      urls.push(
        {
          url: baseUrl,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 1.0,
        },
        {
          url: `${baseUrl}/download`,
          lastModified: currentDate,
          changeFrequency: "daily",
          priority: 0.9,
        },
        {
          url: `${baseUrl}/bookmark`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        {
          url: `${baseUrl}/history`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        {
          url: `${baseUrl}/contact`,
          lastModified: currentDate,
          changeFrequency: "monthly",
          priority: 0.5,
        }
      );
    }

    // Calculate which page of series to fetch based on sitemap number
    // Each sitemap gets 1 page of series (50 series) + their chapters (50 chapters each = 2,500 URLs per sitemap)
    const seriesPage = sitemapNumber;

    // Fetch series for this sitemap
    const response = await fetch(`${API_BASE_URL}/api/series-list?page=${seriesPage}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Add series pages
        data.data.forEach((series: any) => {
          if (series.slug) {
            // Add series page
            urls.push({
              url: `${baseUrl}/series/${series.slug}`,
              lastModified: currentDate,
              changeFrequency: "weekly",
              priority: 0.8,
            });

            // Add chapter pages (estimate 50 chapters per series)
            for (let chapterNum = 1; chapterNum <= 50; chapterNum++) {
              urls.push({
                url: `${baseUrl}/series/${series.slug}/chapter-${chapterNum}`,
                lastModified: currentDate,
                changeFrequency: "monthly",
                priority: 0.6,
              });
            }
          }
        });
      }
    }
  } catch (error) {
    console.error(`Error generating sitemap ${sitemapNumber}:`, error);
  }

  // If no URLs were generated, add at least one to prevent empty sitemap
  if (urls.length === 0) {
    urls.push({
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    });
  }

  return urls;
}

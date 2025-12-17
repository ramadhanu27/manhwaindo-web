import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://manhwaindo.web.id";
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
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
    },
  ];

  // Fetch series data from API
  let seriesPages: MetadataRoute.Sitemap = [];

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rdapi.vercel.app";

    // Fetch multiple pages of series (50 pages = ~2500 series)
    const pagePromises = [];
    for (let page = 1; page <= 50; page++) {
      pagePromises.push(
        fetch(`${API_BASE_URL}/api/series-list?page=${page}`, {
          next: { revalidate: 86400 }, // Cache for 24 hours
        })
          .then((res) => res.json())
          .catch(() => ({ success: false, data: [] }))
      );
    }

    const pagesData = await Promise.all(pagePromises);

    // Process series data
    const allSeries: any[] = [];
    pagesData.forEach((data) => {
      if (data.success && Array.isArray(data.data)) {
        allSeries.push(...data.data);
      }
    });

    // Deduplicate by slug
    const uniqueSeries = Array.from(new Map(allSeries.map((item) => [item.slug, item])).values());

    console.log(`Generating sitemap for ${uniqueSeries.length} series...`);

    // Generate series pages
    seriesPages = uniqueSeries.map((series: any) => ({
      url: `${baseUrl}/series/${series.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Generate chapter pages (limit to prevent too many URLs)
    // For each series, add up to 20 recent chapters
    const chapterPages: MetadataRoute.Sitemap = [];

    for (const series of uniqueSeries.slice(0, 400)) {
      // Top 400 series
      try {
        const detailRes = await fetch(`${API_BASE_URL}/api/series/${series.slug}`, {
          next: { revalidate: 86400 },
        });
        const detailData = await detailRes.json();

        if (detailData.success && detailData.data?.chapters) {
          const chapters = detailData.data.chapters.slice(0, 20); // Latest 20 chapters

          chapters.forEach((chapter: any) => {
            const chapterSlug = chapter.slug.replace(/\/+$/, "").trim();
            chapterPages.push({
              url: `${baseUrl}/series/${series.slug}/${chapterSlug}`,
              lastModified: currentDate,
              changeFrequency: "monthly",
              priority: 0.6,
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching chapters for ${series.slug}:`, error);
      }
    }

    console.log(`Generated ${chapterPages.length} chapter URLs`);
    seriesPages.push(...chapterPages);
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  const allPages = [...staticPages, ...seriesPages];
  console.log(`Total sitemap URLs: ${allPages.length}`);

  return allPages;
}

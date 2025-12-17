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

  // Generate series and chapter URLs
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    console.log("🚀 Starting sitemap generation...");
    const API_BASE_URL = "https://rdapi.vercel.app";

    // Fetch series list from multiple pages in parallel
    const totalPages = 200; // Fetch 200 pages for maximum coverage
    const batchSize = 20; // Process 20 pages at a time to avoid overwhelming the API

    for (let batchStart = 1; batchStart <= totalPages; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize - 1, totalPages);
      console.log(`📦 Fetching pages ${batchStart}-${batchEnd}...`);

      const batchPromises = [];
      for (let page = batchStart; page <= batchEnd; page++) {
        batchPromises.push(
          fetch(`${API_BASE_URL}/api/series-list?page=${page}`, {
            next: { revalidate: 86400 },
            signal: AbortSignal.timeout(10000), // 10 second timeout
          })
            .then((res) => (res.ok ? res.json() : null))
            .catch((err) => {
              console.error(`❌ Error fetching page ${page}:`, err.message);
              return null;
            })
        );
      }

      const batchResults = await Promise.all(batchPromises);

      // Process batch results
      batchResults.forEach((data, index) => {
        if (data?.success && Array.isArray(data.data)) {
          const page = batchStart + index;
          console.log(`✅ Page ${page}: ${data.data.length} series`);

          data.data.forEach((series: any) => {
            if (series.slug) {
              // Add series page
              dynamicPages.push({
                url: `${baseUrl}/series/${series.slug}`,
                lastModified: currentDate,
                changeFrequency: "weekly",
                priority: 0.8,
              });

              // Generate chapter URLs (estimate 50 chapters per series)
              // We'll generate URLs without fetching details to save time
              for (let chapterNum = 1; chapterNum <= 50; chapterNum++) {
                dynamicPages.push({
                  url: `${baseUrl}/series/${series.slug}/chapter-${chapterNum}`,
                  lastModified: currentDate,
                  changeFrequency: "monthly",
                  priority: 0.6,
                });
              }
            }
          });
        }
      });

      console.log(`📊 Current total URLs: ${staticPages.length + dynamicPages.length}`);

      // Stop if we have enough URLs
      if (dynamicPages.length >= 10000) {
        console.log("✅ Reached 10,000+ URLs, stopping...");
        break;
      }
    }
  } catch (error) {
    console.error("❌ Error generating dynamic sitemap:", error);
  }

  const allPages = [...staticPages, ...dynamicPages];
  console.log(`🎉 Total sitemap URLs generated: ${allPages.length}`);

  return allPages;
}

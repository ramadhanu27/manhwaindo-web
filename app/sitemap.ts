import { MetadataRoute } from "next";

// This generates a sitemap index that splits URLs into multiple sitemap files
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://manhwaindo.web.id";

  // Generate sitemap index entries
  // Each post-sitemap file will contain ~1000 URLs
  const sitemapIndexEntries: MetadataRoute.Sitemap = [];

  // Generate 256 sitemap files (like the reference)
  // This will cover 256,000 potential URLs
  for (let i = 1; i <= 256; i++) {
    sitemapIndexEntries.push({
      url: `${baseUrl}/post-sitemap${i}.xml`,
      lastModified: new Date(),
    });
  }

  return sitemapIndexEntries;
}

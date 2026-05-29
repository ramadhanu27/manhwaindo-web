// Run: node scripts/generate-sitemap.mjs
// Generates public/sitemap.xml locally (API not blocked from your PC)

const SITE_URL = "https://manhwaindo-web.vercel.app";

async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`https://manhwaindo.web.id/wp-json/flavor/v1/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function main() {
  console.log("🔄 Generating sitemap...\n");

  const urls = [];

  // ═══ Static pages ═══
  urls.push({ loc: SITE_URL, priority: "1.0", changefreq: "daily" });
  urls.push({ loc: `${SITE_URL}/manhwa`, priority: "0.9", changefreq: "daily" });
  urls.push({ loc: `${SITE_URL}/trending`, priority: "0.8", changefreq: "daily" });
  console.log(`✅ ${urls.length} static pages`);

  // ═══ Genre pages ═══
  try {
    const genresData = await fetchAPI("genres");
    if (genresData.success) {
      for (const genre of genresData.data) {
        urls.push({
          loc: `${SITE_URL}/manhwa/genre/${genre.slug}`,
          priority: "0.7",
          changefreq: "weekly",
        });
      }
      console.log(`✅ ${genresData.data.length} genre pages`);
    }
  } catch (err) {
    console.error("❌ Failed to fetch genres:", err.message);
  }

  // ═══ Comic pages ═══
  try {
    const firstPage = await fetchAPI("manhwa", { per_page: "1" });
    const total = firstPage.meta?.total || 0;
    console.log(`📊 Total comics: ${total}`);

    const pageCount = Math.ceil(total / 50);
    let comicCount = 0;

    for (let i = 1; i <= pageCount; i++) {
      try {
        const data = await fetchAPI("manhwa", { per_page: "50", page: String(i) });
        if (data.success && data.data) {
          for (const comic of data.data) {
            urls.push({
              loc: `${SITE_URL}/komik/${comic.slug}`,
              priority: "0.6",
              changefreq: "weekly",
            });
            comicCount++;
          }
        }
        process.stdout.write(`\r  Fetching page ${i}/${pageCount} (${comicCount} comics)...`);
      } catch (err) {
        console.error(`\n  ⚠️ Failed page ${i}: ${err.message}`);
      }
    }
    console.log(`\n✅ ${comicCount} comic pages`);
  } catch (err) {
    console.error("❌ Failed to fetch comics:", err.message);
  }

  // ═══ Build XML ═══
  const today = new Date().toISOString().split("T")[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  // ═══ Write file ═══
  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");

  console.log(`\n🎉 Sitemap generated: ${outPath}`);
  console.log(`📄 Total URLs: ${urls.length}`);
}

main().catch(console.error);

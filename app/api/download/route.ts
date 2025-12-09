import { NextRequest, NextResponse } from "next/server";

// Use Edge Runtime for Cloudflare Pages compatibility
export const runtime = "edge";

/**
 * GET /api/download/chapters
 * Fetch chapter images data from external API
 *
 * Uses 3 main endpoints:
 * 1. GET /api/search?q={query} - Search manhwa
 * 2. GET /api/series/{slug} - Get series detail + chapters
 * 3. GET /api/chapter/{slug} - Get chapter images
 *
 * Query params:
 * - series: series slug
 * - chapters: comma-separated chapter slugs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seriesSlug = searchParams.get("series");
    const chaptersParam = searchParams.get("chapters");

    console.log("=== Download API Called ===");
    console.log(`Series: ${seriesSlug}`);
    console.log(`Chapters: ${chaptersParam}`);

    if (!seriesSlug || !chaptersParam) {
      console.error("Missing parameters");
      return NextResponse.json({ error: "Missing series or chapters parameter" }, { status: 400 });
    }

    const chapters = chaptersParam.split(",").filter((c) => c.trim());

    if (chapters.length === 0) {
      console.error("No chapters provided");
      return NextResponse.json({ error: "No chapters provided" }, { status: 400 });
    }

    console.log(`Processing ${chapters.length} chapters`);

    // Step 1: Fetch series detail from external API
    console.log(`Fetching series: ${seriesSlug}`);
    const seriesResponse = await fetch(`https://rdapi.vercel.app//api/series/${seriesSlug}`, { signal: AbortSignal.timeout(10000) });

    if (!seriesResponse.ok) {
      console.error(`Series fetch failed: ${seriesResponse.status}`);
      return NextResponse.json({ error: `Series not found (${seriesResponse.status})` }, { status: 404 });
    }

    const seriesData = await seriesResponse.json();
    console.log(`Series data received: ${seriesData.success}`);

    if (!seriesData.success || !seriesData.data) {
      console.error("Invalid series data");
      return NextResponse.json({ error: "Invalid series data" }, { status: 400 });
    }

    // Step 2: Fetch chapter images for each chapter
    const chapterData: any[] = [];
    const seriesChapters = seriesData.data.chapters || [];

    console.log(`Series has ${seriesChapters.length} chapters available`);

    for (const chapterSlug of chapters) {
      try {
        // Clean chapter slug
        const cleanChapterSlug = chapterSlug.replace(/\/+$/, "").trim();
        console.log(`\nFetching chapter: ${cleanChapterSlug}`);

        // Find chapter title from series chapters
        const foundChapter = seriesChapters.find((ch: any) => {
          const cleanSeriesChapterSlug = (ch.slug || "").replace(/\/+$/, "").trim();
          return cleanSeriesChapterSlug === cleanChapterSlug;
        });

        const chapterTitle = foundChapter?.title || cleanChapterSlug;
        let images: string[] = [];

        // Step 3: Fetch chapter images using the chapter slug
        try {
          console.log(`  Fetching images from: /api/chapter/${cleanChapterSlug}`);
          const chapterResponse = await fetch(`https://rdapi.vercel.app//api/chapter/${cleanChapterSlug}`, { signal: AbortSignal.timeout(10000) });

          if (chapterResponse.ok) {
            const chapterDetail = await chapterResponse.json();
            console.log(`  Response success: ${chapterDetail.success}`);

            if (chapterDetail.success && chapterDetail.data?.images) {
              images = chapterDetail.data.images;
              console.log(`  ✓ Found ${images.length} images`);
            } else {
              console.warn(`  ✗ No images in response`);
            }
          } else {
            console.warn(`  ✗ Chapter fetch failed: ${chapterResponse.status}`);
          }
        } catch (err) {
          console.error(`  ✗ Error fetching chapter: ${err}`);
        }

        // Add chapter data (even if no images found)
        chapterData.push({
          slug: cleanChapterSlug,
          title: chapterTitle,
          images: images,
        });

        console.log(`  Added: ${chapterTitle} (${images.length} images)`);
      } catch (error) {
        console.error(`Error processing chapter ${chapterSlug}:`, error);
      }
    }

    if (chapterData.length === 0) {
      return NextResponse.json({ error: "No chapters found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: chapterData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chapter fetch API error:", error);
    return NextResponse.json({ error: "Failed to fetch chapter data" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/proxy-image?url={imageUrl}
 * Proxy image requests to bypass CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Validate URL is from expected domains (allow common image hosting services)
    const allowedDomains = ["gmbr.pro", "img-id.gmbr.pro", "manhwaindo.my", "manhwaindo.com", "manhwaindo.net", "manhwaindo.id", "i.imgur.com", "cdn.discordapp.com", "media.discordapp.net"];

    const isValidDomain = allowedDomains.some((domain) => imageUrl.includes(domain));

    if (!isValidDomain) {
      console.warn(`Blocked image from untrusted domain: ${imageUrl}`);
      return NextResponse.json({ error: "Invalid image domain" }, { status: 403 });
    }

    console.log(`Proxying image: ${imageUrl}`);

    // Fetch image from external server with longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://manhwaindo.my/",
          Origin: "https://manhwaindo.my",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error(`Image fetch failed: ${response.status}`);
        clearTimeout(timeoutId);
        return NextResponse.json({ error: `Failed to fetch image: ${response.status}` }, { status: response.status });
      }

      const blob = await response.blob();
      clearTimeout(timeoutId);
      console.log(`✓ Image proxied: ${blob.size} bytes`);

      // Return image with proper headers
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": blob.type || "image/jpeg",
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Image fetch error:", fetchError);

      // Handle timeout specifically
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json({ error: "Image fetch timeout" }, { status: 504 });
      }

      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}

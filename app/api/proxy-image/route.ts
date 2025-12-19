import { NextRequest, NextResponse } from "next/server";

// Edge Runtime for Cloudflare Pages
export const runtime = "edge";

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
    const allowedDomains = ["gmbr.pro", "kacu.gmbr.pro", "img-id.gmbr.pro", "manhwaindo.my", "manhwaindo.com", "manhwaindo.net", "manhwaindo.id", "i.imgur.com", "cdn.discordapp.com", "media.discordapp.net"];

    const isValidDomain = allowedDomains.some((domain) => imageUrl.includes(domain));

    if (!isValidDomain) {
      console.warn(`Blocked image from untrusted domain: ${imageUrl}`);
      return NextResponse.json({ error: "Invalid image domain" }, { status: 403 });
    }

    console.log(`Proxying image: ${imageUrl}`);

    // Try multiple strategies to fetch the image
    const strategies = [
      // Strategy 1: Full browser headers
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Referer: "https://www.manhwaindo.my/",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          "Sec-Fetch-Dest": "image",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site",
        },
      },
      // Strategy 2: Minimal headers (sometimes works better)
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://www.manhwaindo.my/",
        },
      },
      // Strategy 3: Different referer
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Referer: imageUrl.substring(0, imageUrl.lastIndexOf("/") + 1),
          Accept: "image/*",
        },
      },
      // Strategy 4: No referer (last resort)
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "image/*",
        },
      },
    ];

    let lastError: any = null;

    // Try each strategy
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`Trying strategy ${i + 1}/${strategies.length}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout per attempt

      try {
        const response = await fetch(imageUrl, {
          headers: strategy.headers as HeadersInit,
          signal: controller.signal,
          redirect: "follow",
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const blob = await response.blob();
          console.log(`✓ Image proxied successfully with strategy ${i + 1}: ${blob.size} bytes`);

          // Return image with proper headers
          return new NextResponse(blob, {
            status: 200,
            headers: {
              "Content-Type": blob.type || "image/jpeg",
              "Cache-Control": "public, max-age=86400", // Cache for 24 hours
              "Access-Control-Allow-Origin": "*",
            },
          });
        } else {
          console.warn(`Strategy ${i + 1} failed: ${response.status}`);
          lastError = new Error(`HTTP ${response.status}`);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        console.warn(`Strategy ${i + 1} error:`, fetchError.message);
        lastError = fetchError;
      }

      // Small delay between retries
      if (i < strategies.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Last resort: Try external CORS proxies
    console.log("Trying external CORS proxies...");
    const corsProxies = [`https://corsproxy.io/?${encodeURIComponent(imageUrl)}`, `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`];

    for (const proxyUrl of corsProxies) {
      try {
        console.log(`Trying external proxy: ${proxyUrl.substring(0, 50)}...`);
        const response = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            console.log(`✓ Image fetched via external proxy: ${blob.size} bytes`);
            return new NextResponse(blob, {
              status: 200,
              headers: {
                "Content-Type": blob.type || "image/jpeg",
                "Cache-Control": "public, max-age=86400",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }
        }
      } catch (proxyError) {
        console.warn(`External proxy failed:`, proxyError);
      }
    }

    // All strategies failed
    console.error(`All strategies failed for: ${imageUrl}`);
    return NextResponse.json(
      {
        error: "Failed to fetch image after multiple attempts",
        details: lastError?.message || "Unknown error",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}

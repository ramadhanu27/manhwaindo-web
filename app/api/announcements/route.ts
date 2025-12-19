import { NextResponse } from "next/server";

// Edge Runtime for Cloudflare Pages
export const runtime = "edge";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch announcements from JSON file
export async function GET(request: Request) {
  try {
    // Get the base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Fetch from public folder (Edge-safe)
    const res = await fetch(`${baseUrl}/data/announcements.json`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        enabled: false,
        announcements: [],
      });
    }

    const data = await res.json();

    // Filter only active announcements
    const activeAnnouncements = data.announcements?.filter((a: any) => a.active) || [];

    return NextResponse.json(
      {
        enabled: data.enabled,
        announcements: activeAnnouncements,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error reading announcements:", error);
    return NextResponse.json({
      enabled: false,
      announcements: [],
    });
  }
}

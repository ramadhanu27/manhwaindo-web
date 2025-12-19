import { NextResponse } from "next/server";
import announcementsData from "@/data/announcements.json";

// Edge Runtime for Cloudflare Pages
export const runtime = "edge";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch announcements from JSON file
export async function GET() {
  try {
    // Filter only active announcements
    const activeAnnouncements = announcementsData.announcements?.filter((a: any) => a.active) || [];

    return NextResponse.json(
      {
        enabled: announcementsData.enabled,
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

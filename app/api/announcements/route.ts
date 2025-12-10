import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch announcements from JSON file
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "announcements.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        enabled: false,
        announcements: [],
      });
    }

    // Read file fresh every time (no caching)
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

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

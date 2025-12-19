import { NextResponse } from "next/server";
import popupData from "@/data/popup.json";

// Edge Runtime for Cloudflare Pages
export const runtime = "edge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(popupData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading popup config:", error);
    return NextResponse.json({ enabled: false });
  }
}

import { NextResponse } from "next/server";

// Edge Runtime for Cloudflare Pages


export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Get the base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Fetch from public folder (Edge-safe)
    const res = await fetch(`${baseUrl}/data/maintenance.json`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ enabled: false });
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading maintenance config:", error);
    return NextResponse.json({ enabled: false });
  }
}

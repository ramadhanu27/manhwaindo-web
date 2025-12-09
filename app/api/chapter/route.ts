import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://rdapi.vercel.app";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, data: { images: [] }, error: "Missing slug parameter" }, { status: 400 });
    }

    const url = `${API_BASE_URL}/api/chapter/${slug}`;
    console.log("Proxying chapter request to:", url);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Chapter API error:", response.status, response.statusText);
      return NextResponse.json({ success: false, data: { images: [] }, error: `API returned ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying chapter request:", error);
    return NextResponse.json({ success: false, data: { images: [] }, error: "Failed to fetch chapter images" }, { status: 500 });
  }
}

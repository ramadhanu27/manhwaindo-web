import { NextRequest, NextResponse } from "next/server";

// Edge Runtime for Cloudflare Pages
export const runtime = "edge";

const API_BASE_URL = "https://rdapi.vercel.app";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const title = searchParams.get("title");
    const order = searchParams.get("order");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const genre = searchParams.get("genre");

    let url: string;

    // If title is provided, use search API
    if (title) {
      url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(title)}`;
    } else {
      // Otherwise use series-list API
      const params = new URLSearchParams();
      params.append("page", page);
      if (order) params.append("order", order);
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      if (genre) params.append("genre", genre);
      url = `${API_BASE_URL}/api/series-list?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying series list:", error);
    return NextResponse.json({ success: false, data: [], error: "Failed to fetch series list" }, { status: 500 });
  }
}

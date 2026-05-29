const API_BASE = "https://manhwaindo.web.id/wp-json/flavor/v1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return Response.json({ error: "Missing endpoint parameter" }, { status: 400 });
  }

  // Build the target URL
  const targetParams = new URLSearchParams();
  for (const [key, value] of searchParams.entries()) {
    if (key !== "endpoint") {
      targetParams.set(key, value);
    }
  }

  const targetUrl = `${API_BASE}/${endpoint}${targetParams.toString() ? `?${targetParams.toString()}` : ""}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://manhwaindo.web.id/",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return Response.json({ error: `API returned ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API Proxy error:", error);
    return Response.json({ error: "Failed to fetch from API" }, { status: 502 });
  }
}

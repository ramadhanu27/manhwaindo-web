// API Client for Manhwaindo API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rdapi.vercel.app/";

export async function getLatest(page = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lastupdate?page=${page}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch latest");
    return await res.json();
  } catch (error) {
    console.error("Error fetching latest:", error);
    return { success: false, data: [] };
  }
}

export async function getLastUpdate(page = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/lastupdate?page=${page}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch last update");
    return await res.json();
  } catch (error) {
    console.error("Error fetching last update:", error);
    return { success: false, data: [] };
  }
}

export async function getProject(page = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/project?page=${page}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch project");
    return await res.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, data: [] };
  }
}

export async function getPopular() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/popular`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch popular");
    return await res.json();
  } catch (error) {
    console.error("Error fetching popular:", error);
    return { success: false, data: [] };
  }
}

export async function getSeriesDetail(slug) {
  try {
    // Use the external API endpoint
    const externalApiUrl = "https://rdapi.vercel.app/api/series";
    const res = await fetch(`${externalApiUrl}/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.warn(`Series detail fetch failed for ${slug}: ${res.status}`);
      return { success: false, data: null };
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching series detail:", error);
    return { success: false, data: null };
  }
}

export async function getChapterImages(slug) {
  if (!slug) {
    console.error("Chapter slug is empty");
    return { success: false, data: { images: [] }, error: "Invalid chapter slug" };
  }

  // Use local API proxy to avoid CORS issues on client-side
  const isClient = typeof window !== "undefined";
  const url = isClient ? `/api/chapter?slug=${encodeURIComponent(slug)}` : `${API_BASE_URL}/api/chapter/${slug}`;

  console.log("Fetching chapter images from:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    console.log("Chapter response status:", res.status, res.ok);

    if (!res.ok) {
      console.error("Chapter fetch failed:", res.status, res.statusText);
      return { success: false, data: { images: [] }, error: `HTTP ${res.status}` };
    }

    const text = await res.text();
    console.log("Raw response:", text.substring(0, 200));

    if (!text) {
      console.error("Empty response from API");
      return { success: false, data: { images: [] }, error: "Empty response" };
    }

    const data = JSON.parse(text);
    console.log("Parsed chapter data:", {
      success: data.success,
      imageCount: data.data?.images?.length || data.images?.length,
      hasImages: !!(data.data?.images || data.images),
    });

    // Normalize response structure
    if (data.success && data.data && !data.data.images && data.images) {
      data.data.images = data.images;
    }

    return data;
  } catch (error) {
    console.error("Error in getChapterImages:", error.message, error.stack);
    return { success: false, data: { images: [] }, error: error.message };
  }
}

export async function searchSeries(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Failed to search series");
    return await res.json();
  } catch (error) {
    console.error("Error searching series:", error);
    return { success: false, data: [] };
  }
}

export async function getSeriesList(page = 1, filters = {}) {
  try {
    // Use local API proxy to avoid CORS issues
    const params = new URLSearchParams();
    params.append("page", page.toString());

    if (filters.title) params.append("title", filters.title);
    if (filters.order) params.append("order", filters.order);
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.genre) params.append("genre", filters.genre);

    const res = await fetch(`/api/series-list?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch series list");
    return await res.json();
  } catch (error) {
    console.error("Error fetching series list:", error);
    return { success: false, data: [] };
  }
}

export async function fetchActualImageUrl(seriesUrl) {
  try {
    if (!seriesUrl) return null;

    // Fetch the series page HTML
    const res = await fetch(seriesUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Extract image URL from og:image meta tag
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (ogImageMatch && ogImageMatch[1]) {
      return ogImageMatch[1];
    }

    // Fallback: look for img tag with class containing 'cover' or 'thumbnail'
    const imgMatch = html.match(/<img[^>]*(?:class=[^>]*(?:cover|thumbnail)[^>]*)?[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }

    return null;
  } catch (error) {
    console.error("Error fetching actual image URL:", error);
    return null;
  }
}

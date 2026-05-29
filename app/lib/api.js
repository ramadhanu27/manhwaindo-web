const API_BASE = "https://manhwaindo.web.id/wp-json/flavor/v1";

/**
 * For server-side fetches (SSR/SSG), call the external API directly with proper headers.
 * For client-side fetches, use our API proxy route.
 */
export function getApiUrl(endpoint, params = {}) {
  const searchParams = new URLSearchParams(params);
  return `${API_BASE}/${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
}

/**
 * Client-side: fetches through our proxy to avoid CORS and IP blocks.
 */
export function getProxyUrl(endpoint, params = {}) {
  const searchParams = new URLSearchParams({ endpoint, ...params });
  return `/api/proxy?${searchParams.toString()}`;
}

/**
 * Server-side fetch with proper headers to avoid being blocked.
 */
export async function fetchApi(endpoint, params = {}, options = {}) {
  const url = getApiUrl(endpoint, params);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
      Referer: "https://manhwaindo.web.id/",
    },
    ...options,
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

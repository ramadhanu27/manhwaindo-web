const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://manhwaindo-web.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

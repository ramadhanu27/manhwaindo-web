import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
    template: "%s | ManhwaIndo",
  },
  description: "Baca manhwa terbaru gratis! Koleksi lengkap komik bahasa Indonesia, update harian. Nikmati ratusan judul populer tanpa biaya.",
  keywords: [
    "manhwa",
    "manhwa indonesia",
    "baca manhwa",
    "komik",
    "manga",
    "webtoon",
    "komik online",
    "baca komik gratis",
    "manhwa terbaru",
    "manhwa update",
    "komik indonesia",
    "baca online",
    "manhwa bahasa indonesia",
    "webtoon indonesia",
  ],
  authors: [{ name: "ManhwaIndo Team" }],
  creator: "ManhwaIndo",
  publisher: "ManhwaIndo",
  metadataBase: new URL("https://manhwaindo.web.id"),
  alternates: {
    canonical: "https://manhwaindo.web.id",
    languages: {
      "id-ID": "https://manhwaindo.web.id",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://manhwaindo.web.id",
    siteName: "ManhwaIndo",
    title: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
    description: "Baca komik manhwa terbaru bahasa Indonesia gratis! Update setiap hari dengan koleksi terlengkap. Nikmati ratusan judul manhwa populer tanpa biaya.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
        type: "image/png",
      },
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "ManhwaIndo Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@manhwaindo",
    creator: "@manhwaindo",
    title: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
    description: "Baca komik manhwa terbaru bahasa Indonesia gratis! Update setiap hari dengan koleksi terlengkap.",
    images: {
      url: "/og-image.png",
      alt: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  category: "entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Ahrefs Site Verification */}
        <meta name="ahrefs-site-verification" content="254a1d3e14472f0c6ece86ded5ff047d89fc21a719bb194b225cfa3fb0902474" />

        {/* Content Freshness Signals */}
        <meta property="og:updated_time" content={new Date().toISOString()} />
        <meta property="article:modified_time" content={new Date().toISOString()} />
        <meta httpEquiv="last-modified" content={new Date().toUTCString()} />

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />

        {/* Structured Data - Organization & Sitelinks Search Box */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ManhwaIndo",
              alternateName: "Manhwa Indo",
              url: "https://manhwaindo.web.id",
              description: "Baca komik manhwa bahasa Indonesia gratis. Update setiap hari dengan koleksi terlengkap.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://manhwaindo.web.id/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "ManhwaIndo",
                url: "https://manhwaindo.web.id",
                logo: {
                  "@type": "ImageObject",
                  url: "https://manhwaindo.web.id/favicon.png",
                },
                sameAs: ["https://manhwaindo.web.id"],
              },
            }),
          }}
        />

        {/* Breadcrumb List for better navigation structure */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://manhwaindo.web.id",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Daftar Manhwa",
                  item: "https://manhwaindo.web.id/series",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Pencarian",
                  item: "https://manhwaindo.web.id/search",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Bookmark",
                  item: "https://manhwaindo.web.id/bookmark",
                },
              ],
            }),
          }}
        />

        {/* Google tag (gtag.js) - Deferred for performance */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CG48R0Q9CE" suppressHydrationWarning></script>
        <script suppressHydrationWarning>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CG48R0Q9CE', {
              'send_page_view': false
            });
            
            // Send pageview after page is interactive
            if (document.readyState === 'complete') {
              gtag('event', 'page_view');
            } else {
              window.addEventListener('load', function() {
                gtag('event', 'page_view');
              });
            }
          `}
        </script>

        {/* Ahrefs Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="JbUlo1ey9vQe5o0YENL6Lw" async suppressHydrationWarning></script>

        <meta name="clckd" content="0336c9b2d4f277ba40af02534815500f" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

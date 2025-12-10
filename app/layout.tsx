import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
  description: "ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa) yang kami update setiap hari secara gratis.",
  keywords: ["manhwa", "komik", "manga", "webtoon", "indonesia", "baca online"],
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
    description: "ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa) yang kami update setiap hari secara gratis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ManhwaIndo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
    description: "ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa) yang kami update setiap hari secara gratis.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head suppressHydrationWarning>
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
        <meta name="clckd" content="0336c9b2d4f277ba40af02534815500f" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

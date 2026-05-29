import "./globals.css";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider";
import HitTracker from "./components/HitTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://galerikomik.cyou";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GaleriKomik - Baca Komik Manhwa Manga Manhua Online Gratis",
    template: "%s | GaleriKomik",
  },
  description: "Baca manhwa, manga, dan manhua terbaru secara online gratis bahasa Indonesia. Update cepat setiap hari, koleksi terlengkap hanya di GaleriKomik. Ribuan judul dari Korea, Jepang, dan China.",
  keywords: [
    "baca komik",
    "manhwa",
    "manga",
    "manhua",
    "komik online",
    "baca manga gratis",
    "baca manhwa",
    "komik bahasa indonesia",
    "webtoon",
    "komik korea",
    "komik jepang",
    "komik china",
    "manhwa indonesia",
    "manga online",
    "baca komik gratis",
    "galerikomik",
    "baca manhwa online",
    "komik terbaru",
    "manhwa terbaru",
  ],
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    title: "GaleriKomik - Baca Komik Manhwa Manga Manhua Online Gratis",
    description: "Baca manhwa, manga, dan manhua terbaru secara online gratis bahasa Indonesia. Update cepat setiap hari.",
    url: SITE_URL,
    siteName: "GaleriKomik",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GaleriKomik - Baca Komik Online Gratis",
    description: "Baca manhwa, manga, dan manhua terbaru secara online gratis bahasa Indonesia.",
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
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Replace with your actual verification codes:
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GaleriKomik",
    url: SITE_URL,
    description: "Baca manhwa, manga, dan manhua terbaru secara online gratis bahasa Indonesia.",
    inLanguage: "id",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/manhwa/search/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <HitTracker />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

// Footer is imported from components/Footer

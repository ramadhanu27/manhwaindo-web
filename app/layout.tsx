import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CG48R0Q9CE" suppressHydrationWarning></script>
        <script suppressHydrationWarning>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CG48R0Q9CE');
          `}
        </script>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="clckd" content="0336c9b2d4f277ba40af02534815500f" />
        <script type='text/javascript' src='//pl28146074.effectivegatecpm.com/75/cc/7a/75cc7ac75f43124043e6b6b0b0a29218.js' suppressHydrationWarning></script>
        <script type="text/javascript" data-cfasync="false" suppressHydrationWarning>
          {`
            /*<![CDATA[/* */
            (function(){var k=window,z="d51c9e89aada8745df465ebb45899487",l=[["siteId",567+180+334+901+404+5255009],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LmRpc3BsYXl2ZXJ0aXNpbmcuY29tL29jb29raWVqYXIubWluLmNzcw==","ZDNtem9rdHk5NTFjNXcuY2xvdWRmcm9udC5uZXQvTVd6L21yb2xsYmFyLm1pbi5qcw=="],i=-1,h,q,c=function(){clearTimeout(q);i++;if(a[i]&&!(1790346019000<(new Date).getTime()&&1<i)){h=k.document.createElement("script");h.type="text/javascript";h.async=!0;var j=k.document.getElementsByTagName("script")[0];h.src="https://"+atob(a[i]);h.crossOrigin="anonymous";h.onerror=c;h.onload=function(){clearTimeout(q);k[z.slice(0,16)+z.slice(0,16)]||c()};q=setTimeout(c,5E3);j.parentNode.insertBefore(h,j)}};if(!k[z]){try{Object.freeze(k[z]=l)}catch(e){}c()}})();
            /*]]>/* */
          `}
        </script>
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

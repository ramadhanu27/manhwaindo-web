import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia",
  description: "ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa) yang kami update setiap hari secara gratis.",
  keywords: ["manhwa", "komik", "manga", "webtoon", "indonesia", "baca online"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="clckd" content="0336c9b2d4f277ba40af02534815500f" />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

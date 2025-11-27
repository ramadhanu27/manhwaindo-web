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
        <script type='text/javascript' src='//pl28146074.effectivegatecpm.com/75/cc/7a/75cc7ac75f43124043e6b6b0b0a29218.js'></script>
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <a href="https://www.effectivegatecpm.com/jbx8smx49b?key=34a57f2ec59337d6d8127347ee416a77"></a>
        <script type='text/javascript' src='//pl28146022.effectivegatecpm.com/7a/bf/d2/7abfd22c695cb44d4bd09dfe203c3de0.js'></script>
      </body>
    </html>
  );
}

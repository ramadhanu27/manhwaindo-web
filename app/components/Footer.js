"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const isChapterReader = /^\/komik\/[^/]+\/[^/]+/.test(pathname);
  if (isChapterReader) return null;

  return (
    <footer className="border-t border-dark-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-dark-100">GaleriKomik</span>
            </div>
            <p className="text-sm text-dark-400 leading-relaxed">
              Platform baca komik online terlengkap. Nikmati ribuan judul manhwa, manga, dan manhua dengan update tercepat.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {["Home", "Popular", "Terbaru", "Genre"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-dark-400 hover:text-dark-100 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Genre */}
          <div>
            <h4 className="text-sm font-semibold text-dark-200 mb-4">Genre Populer</h4>
            <div className="flex flex-wrap gap-2">
              {["Action", "Romance", "Fantasy", "Comedy", "Drama", "Horror"].map((g) => (
                <span key={g} className="px-3 py-1 rounded-lg text-xs font-medium bg-dark-800 text-dark-300 border border-dark-700 hover:border-dark-500 hover:text-dark-100 transition-all cursor-pointer">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider mt-8 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">© 2026 GaleriKomik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

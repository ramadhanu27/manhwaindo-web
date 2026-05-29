"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getProxyUrl } from "@/app/lib/api";

export default function BottomNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Search state
  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileSearching, setMobileSearching] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setMobileQuery("");
    setMobileResults([]);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Mobile search — debounced
  useEffect(() => {
    if (!mobileQuery.trim()) {
      setMobileResults([]);
      return;
    }
    setMobileSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(getProxyUrl("manhwa", { search: mobileQuery.trim(), per_page: 6 }));
        const json = await res.json();
        if (json.success) setMobileResults(json.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setMobileSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [mobileQuery]);

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileQuery.trim()) {
      router.push(`/manhwa/search/${encodeURIComponent(mobileQuery.trim())}`);
      setIsMenuOpen(false);
      setMobileQuery("");
    }
  };

  const NAV_ITEMS = [
    {
      label: "Home",
      href: "/",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      exact: true,
    },
    {
      label: "Komik",
      href: "/manhwa",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      label: "Trending",
      href: "/trending",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    },
    {
      label: "Cari",
      href: "/manhwa",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    },
  ];

  const isActive = (item) => {
    if (item.label === "Menu") return isMenuOpen;
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  // Hide on chapter reader pages: /komik/[slug]/[chapterSlug]
  const isChapterReader = /^\/komik\/[^/]+\/[^/]+/.test(pathname);
  if (isChapterReader) return null;

  return (
    <>
      {/* ═══ Mobile Menu Overlay ═══ */}
      <div className={`md:hidden fixed inset-0 bottom-16 z-40 transition-all duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80" onClick={() => setIsMenuOpen(false)} />

        {/* Menu panel — slides up from bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-dark-900 border-t border-dark-700 rounded-t-2xl shadow-2xl shadow-black/60 transition-all duration-300 max-h-[75vh] overflow-y-auto ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
          {/* Drag indicator */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-dark-600" />
          </div>

          <div className="px-5 pb-6 pt-2">
            {/* Mobile search */}
            <form onSubmit={handleMobileSearchSubmit} className="relative mb-5">
              <input
                type="text"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Cari komik..."
                className="w-full px-4 py-3 pl-11 rounded-lg bg-dark-800 border border-dark-600 text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-accent-500 transition-colors"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {mobileQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileQuery("");
                    setMobileResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center text-dark-400 hover:text-dark-100 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>

            {/* Mobile search results */}
            {mobileQuery.trim() && (
              <div className="mb-5 space-y-1">
                {mobileSearching ? (
                  <div className="space-y-2 px-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3 py-1">
                        <div className="w-9 h-12 skeleton rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3 skeleton rounded w-3/4" />
                          <div className="h-2.5 skeleton rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : mobileResults.length === 0 ? (
                  <p className="text-xs text-dark-400 text-center py-3">Tidak ada hasil untuk &quot;{mobileQuery}&quot;</p>
                ) : (
                  <>
                    {mobileResults.map((comic) => (
                      <Link key={comic.id} href={`/komik/${comic.slug}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-dark-800 transition-colors">
                        <div className="relative w-9 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={comic.cover} alt={comic.title} fill className="object-cover" sizes="36px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-200 truncate">{comic.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold uppercase ${comic.status === "completed" ? "text-neon-green" : "text-neon-blue"}`}>{comic.status}</span>
                            <span className="text-[10px] text-dark-500">{comic.type}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link href={`/manhwa/search/${encodeURIComponent(mobileQuery)}`} onClick={() => setIsMenuOpen(false)} className="block text-center py-2 text-xs font-medium text-accent-400 hover:bg-dark-800 rounded-lg transition-colors">
                      Lihat semua hasil →
                    </Link>
                  </>
                )}
                <div className="section-divider" />
              </div>
            )}

            {/* Nav links */}
            <nav className="space-y-1">
              {[
                { label: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                { label: "Daftar Komik", href: "/manhwa", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { label: "Trending", href: "/trending", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
                { label: "Terbaru", href: "/#latest-updates", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-dark-200 hover:text-dark-100 hover:bg-dark-800 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center group-hover:border-dark-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="section-divider my-4" />

            {/* Genre tags */}
            <div>
              <p className="text-xs text-dark-500 font-medium uppercase tracking-wider mb-3 px-1">Genre Populer</p>
              <div className="flex flex-wrap gap-2 px-1">
                {["Action", "Romance", "Fantasy", "Comedy", "Drama", "Horror"].map((g) => (
                  <Link
                    key={g}
                    href={`/manhwa/genre/${g.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-800 text-dark-300 border border-dark-700 hover:border-dark-500 hover:text-dark-100 transition-all">
                    {g}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bottom Navigation Bar ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900 border-t border-dark-700 safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.label} href={item.href} className={`flex flex-col items-center justify-center gap-1 w-full h-full relative group transition-colors ${active ? "text-accent-400" : "text-dark-500"}`}>
                {active && <span className="absolute top-1 w-1 h-1 rounded-full bg-accent-400" />}
                <svg className={`w-5 h-5 transition-colors ${active ? "text-accent-400" : "text-dark-500 group-hover:text-dark-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d={item.icon} />
                </svg>
                <span className={`text-[10px] font-medium transition-colors ${active ? "text-accent-400" : "text-dark-500 group-hover:text-dark-300"}`}>{item.label}</span>
              </Link>
            );
          })}

          {/* Menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`flex flex-col items-center justify-center gap-1 w-full h-full relative group transition-colors ${isMenuOpen ? "text-accent-400" : "text-dark-500"}`}>
            {isMenuOpen && <span className="absolute top-1 w-1 h-1 rounded-full bg-accent-400" />}
            <div className="w-5 h-3.5 relative flex flex-col justify-between">
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
              <span className={`block h-[2px] w-3 mx-auto bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-0" : ""}`} />
              <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
            </div>
            <span className={`text-[10px] font-medium transition-colors ${isMenuOpen ? "text-accent-400" : "text-dark-500 group-hover:text-dark-300"}`}>Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}

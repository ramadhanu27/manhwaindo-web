"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

import { getProxyUrl } from "@/app/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Desktop search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close on route change
  useEffect(() => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Desktop search — debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(getProxyUrl("manhwa", { search: query.trim(), per_page: 6 }));
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
          setShowResults(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/manhwa/search/${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      setQuery("");
    }
  };

  const isChapterReader = /^\/komik\/[^/]+\/[^/]+/.test(pathname);
  if (isChapterReader) return null;

  return (
    <header className="bg-dark-900 border-b border-dark-700 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1 group text-xl font-extrabold tracking-tight">
            <span className="text-dark-100 group-hover:text-white transition-colors">Galeri</span>
            <span className="text-accent-500">Komik</span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-dark-200 hover:text-dark-100 transition-colors">
              Home
            </a>
            <a href="/manhwa" className="text-sm font-medium text-dark-200 hover:text-dark-100 transition-colors">
              Daftar Komik
            </a>
            <a href="/trending" className="text-sm font-medium text-dark-200 hover:text-dark-100 transition-colors">
              Trending
            </a>
            <a href="/#latest-updates" className="text-sm font-medium text-dark-200 hover:text-dark-100 transition-colors">
              Terbaru
            </a>
          </nav>

          {/* Theme toggle + Desktop search */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => results.length > 0 && setShowResults(true)}
                  placeholder="Cari komik..."
                  className="w-48 lg:w-64 px-4 py-2 pl-10 rounded-lg bg-dark-800 border border-dark-600 text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-accent-500 transition-colors"
                />
              </form>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setShowResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-dark-600 flex items-center justify-center text-dark-400 hover:text-dark-100 transition-colors">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 w-80 lg:w-96 right-0 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  {searching ? (
                    <div className="p-4 space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-10 h-14 skeleton rounded-lg flex-shrink-0" />
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 skeleton rounded w-3/4" />
                            <div className="h-3 skeleton rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : results.length === 0 ? (
                    <div className="p-6 text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-dark-400">Tidak ada hasil untuk &quot;{query}&quot;</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-2">
                        {results.map((comic) => (
                          <Link
                            key={comic.id}
                            href={`/komik/${comic.slug}`}
                            onClick={() => {
                              setShowResults(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-700 transition-colors group">
                            <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={comic.cover} alt={comic.title} fill className="object-cover" sizes="40px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark-100 group-hover:text-accent-500 transition-colors truncate">{comic.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-semibold uppercase ${comic.status === "completed" ? "text-neon-green" : "text-neon-blue"}`}>{comic.status}</span>
                                <span className="text-[10px] text-dark-400">{comic.type}</span>
                                {comic.rating && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-rating-gold">
                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {comic.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/manhwa/search/${encodeURIComponent(query)}`}
                        onClick={() => {
                          setShowResults(false);
                          setQuery("");
                        }}
                        className="block text-center py-3 text-xs font-medium text-accent-400 hover:bg-dark-700 border-t border-dark-700 transition-colors">
                        Lihat semua hasil untuk &quot;{query}&quot; →
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-dark-300 hover:text-accent-500 hover:bg-dark-700 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}>
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

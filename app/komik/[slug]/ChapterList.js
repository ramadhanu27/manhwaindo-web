"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function ChapterList({ chapters, slug }) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  const filtered = useMemo(() => {
    let list = [...chapters];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((ch) => 
        (ch.title && ch.title.toLowerCase().includes(q)) || 
        (ch.number && ch.number.toString().toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortAsc) list.reverse();

    return list;
  }, [chapters, search, sortAsc]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(30);
            }}
            placeholder="Cari chapter..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-dark-800/80 border border-dark-600/50 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-xs font-medium text-dark-300 hover:text-accent-400 hover:border-accent-500/30 transition-all flex-shrink-0"
          title={sortAsc ? "Urutkan Terbaru" : "Urutkan Terlama"}>
          <svg className={`w-4 h-4 transition-transform ${sortAsc ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {sortAsc ? "Terlama" : "Terbaru"}
        </button>
      </div>

      {/* Chapter items */}
      {displayed.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-dark-500">Tidak ada chapter ditemukan.</p>
        </div>
      ) : (
        <div className="max-h-[380px] overflow-y-auto pr-1.5 space-y-1">
          {displayed.map((ch, i) => (
            <Link key={`${ch.slug}-${i}`} href={`/komik/${slug}/${ch.slug}`} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-dark-700/30 group transition-all">
              <div className="flex items-center gap-3 min-w-0">
                {/* Chapter icon */}
                <div className="w-8 h-8 rounded-lg bg-dark-800/60 border border-dark-700/50 flex items-center justify-center flex-shrink-0 group-hover:border-accent-500/30 group-hover:bg-accent-500/5 transition-all">
                  <svg className="w-4 h-4 text-dark-400 group-hover:text-accent-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-dark-200 group-hover:text-accent-400 transition-colors truncate">{ch.title}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-dark-500">{ch.date}</span>
                <svg className="w-4 h-4 text-dark-600 group-hover:text-accent-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 30)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass text-sm font-medium text-dark-300 hover:text-accent-400 hover:border-accent-500/30 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Tampilkan Lebih Banyak ({filtered.length - visibleCount} tersisa)
          </button>
        </div>
      )}
    </div>
  );
}

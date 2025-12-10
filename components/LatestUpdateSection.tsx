"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ViewToggle from "./ViewToggle";
import { extractSeriesSlug, encodeSlug } from "@/lib/slug-utils";

interface LatestUpdateSectionProps {
  series: any[];
}

export default function LatestUpdateSection({ series }: LatestUpdateSectionProps) {
  const [view, setView] = useState<"grid" | "list" | "compact">("grid");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="mb-8">
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
            <h2 className="text-lg font-bold text-white">Latest Update</h2>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {series.slice(0, 12).map((item: any) => (
              <div key={item.slug} className="bg-[#2a3142] rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
          <h2 className="text-lg font-bold text-white">Latest Update</h2>
          <div className="flex items-center gap-3">
            <ViewToggle onViewChange={setView} />
            <Link href="/search?order=update" className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors">
              VIEW ALL
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {view === "grid" && (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {series.slice(0, 28).map((item: any) => (
                <div key={item.slug} className="bg-[#2a3142] rounded-lg overflow-hidden hover:ring-2 hover:ring-green-500/50 transition-all group">
                  <div className="flex gap-3 p-3">
                    {/* Thumbnail */}
                    <Link href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`} className="flex-shrink-0">
                      <div className="relative w-20 h-28 rounded overflow-hidden bg-gray-700">
                        {item.type && <span className="absolute top-0 left-0 bg-purple-600 text-white px-1.5 py-0.5 text-[9px] font-bold">{item.type.charAt(0).toUpperCase()}</span>}
                        <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`}>
                        <h3 className="font-semibold text-sm text-white line-clamp-2 mb-2 hover:text-green-400 transition-colors">{item.title}</h3>
                      </Link>

                      {/* Chapters */}
                      <div className="space-y-1">
                        {item.chapters &&
                          item.chapters.slice(0, 3).map((chapter: any, idx: number) => (
                            <Link
                              key={idx}
                              href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}/${encodeSlug(extractSeriesSlug(chapter.slug))}`}
                              className="flex items-center justify-between text-xs text-gray-400 hover:text-green-400 transition-colors">
                              <span className="truncate">{chapter.title}</span>
                              {chapter.time && <span className="text-gray-500 flex-shrink-0 ml-2">{chapter.time}</span>}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            // List View
            <div className="space-y-2">
              {series.slice(0, 20).map((item: any) => (
                <div key={item.slug} className="flex items-center gap-4 p-3 bg-[#2a3142] rounded-lg hover:ring-2 hover:ring-green-500/50 transition-all">
                  <Link href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`} className="flex-shrink-0">
                    <div className="relative w-12 h-16 rounded overflow-hidden bg-gray-700">
                      <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`}>
                      <h3 className="font-semibold text-sm text-white line-clamp-1 hover:text-green-400 transition-colors">{item.title}</h3>
                    </Link>
                    {item.chapters && item.chapters[0] && (
                      <Link href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}/${encodeSlug(extractSeriesSlug(item.chapters[0].slug))}`} className="text-xs text-gray-400 hover:text-green-400 transition-colors">
                        {item.chapters[0].title}
                      </Link>
                    )}
                  </div>
                  {item.chapters && item.chapters[0]?.time && <span className="text-xs text-gray-500">{item.chapters[0].time}</span>}
                </div>
              ))}
            </div>
          )}

          {view === "compact" && (
            // Compact View
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {series.slice(0, 24).map((item: any) => (
                <Link key={item.slug} href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`} className="p-2 bg-[#2a3142] rounded hover:ring-2 hover:ring-green-500/50 transition-all">
                  <h3 className="text-xs text-white line-clamp-2 hover:text-green-400 transition-colors">{item.title}</h3>
                  {item.chapters && item.chapters[0] && <p className="text-[10px] text-gray-500 mt-1 truncate">{item.chapters[0].title}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

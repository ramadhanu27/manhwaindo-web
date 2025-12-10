"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ViewToggle from "../search/ViewToggle";
import { extractSeriesSlug, encodeSlug } from "@/lib/slug-utils";

interface ProjectUpdatesSectionProps {
  series: any[];
}

export default function ProjectUpdatesSection({ series }: ProjectUpdatesSectionProps) {
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
            <h2 className="text-lg font-bold text-white">Project Update</h2>
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
          <h2 className="text-lg font-bold text-white">Project Update</h2>
          <div className="flex items-center gap-3">
            <ViewToggle onViewChange={setView} />
            <Link href="/search" className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors">
              VIEW MORE
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {view === "grid" && (
            // Grid View - Card style like reference
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {series.slice(0, 12).map((item: any) => (
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
                              className="flex items-center justify-between text-xs hover:text-green-400 transition-colors group/ch">
                              <span className="text-gray-400 group-hover/ch:text-green-400 truncate flex items-center gap-1">
                                <span className="text-gray-600">•</span>
                                {chapter.title}
                              </span>
                              <span className="text-gray-600 text-[10px] ml-2 flex-shrink-0">{chapter.time || "baru"}</span>
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
            <div className="space-y-3">
              {series.slice(0, 12).map((item: any) => (
                <Link key={item.slug} href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`} className="flex items-center gap-4 p-4 bg-[#2a3142] rounded-lg hover:ring-2 hover:ring-green-500/50 transition-all group">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-24 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                    {item.type && <span className="absolute top-0 left-0 bg-purple-600 text-white px-1.5 py-0.5 text-[8px] font-bold">{item.type.charAt(0).toUpperCase()}</span>}
                    <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">{item.title}</h3>
                    {item.chapters && item.chapters.length > 0 && <p className="text-sm text-gray-400 line-clamp-1">Latest: {item.chapters[0].title}</p>}
                  </div>

                  {/* Latest Chapter Time */}
                  {item.chapters && item.chapters.length > 0 && <span className="text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">{item.chapters[0].time || "baru"}</span>}
                </Link>
              ))}
            </div>
          )}

          {view === "compact" && (
            // Compact View
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {series.slice(0, 12).map((item: any) => (
                <Link key={item.slug} href={`/series/${encodeSlug(extractSeriesSlug(item.slug))}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-700 hover:ring-2 hover:ring-green-500 transition-all">
                    {item.type && <span className="absolute top-1 left-1 bg-purple-600 text-white px-1.5 py-0.5 text-[8px] font-bold rounded z-10">{item.type.charAt(0).toUpperCase()}</span>}
                    <img src={item.image || "/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h3 className="text-xs font-semibold text-white mt-2 line-clamp-2 group-hover:text-green-400 transition-colors">{item.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

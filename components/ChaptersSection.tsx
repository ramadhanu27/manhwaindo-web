"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { extractSeriesSlug, encodeSlug } from "@/lib/slug-utils";

interface Chapter {
  title: string;
  slug: string;
  time?: string;
}

interface ChaptersSectionProps {
  chapters: Chapter[];
  seriesSlug: string;
  seriesTitle: string;
}

export default function ChaptersSection({ chapters, seriesSlug, seriesTitle }: ChaptersSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Real-time search filter and sort
  const filteredChapters = useMemo(() => {
    let result = chapters;

    if (searchQuery.trim()) {
      result = chapters.filter((chapter) => {
        const query = searchQuery.toLowerCase();
        return chapter.title.toLowerCase().includes(query) || chapter.slug.toLowerCase().includes(query);
      });
    }

    // Sort chapters
    return [...result].sort((a, b) => {
      // Extract chapter number from title for proper sorting
      const numA = parseFloat(a.title.replace(/[^\d.]/g, "")) || 0;
      const numB = parseFloat(b.title.replace(/[^\d.]/g, "")) || 0;
      return sortOrder === "asc" ? numA - numB : numB - numA;
    });
  }, [chapters, searchQuery, sortOrder]);

  return (
    <div>
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari Chapter. Contoh: 25 atau 178"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#2a3142] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-4 py-2.5 bg-[#2a3142] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-green-500 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {sortOrder === "asc" ? "Terlama" : "Terbaru"}
        </button>
      </div>

      {/* Chapters List with Scroll */}
      {chapters && chapters.length > 0 ? (
        <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-2">
            {filteredChapters.map((chapter: any, idx: number) => (
              <Link
                key={idx}
                href={`/series/${encodeSlug(seriesSlug)}/${encodeSlug(extractSeriesSlug(chapter.slug))}`}
                className="flex items-center justify-between p-3 bg-[#2a3142] border border-gray-700 rounded-lg hover:border-green-500 hover:bg-[#2f3847] transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-sm text-gray-200 group-hover:text-green-400 transition-colors">{chapter.title}</span>
                </div>
                {chapter.time && <span className="text-xs text-gray-500">{chapter.time}</span>}
              </Link>
            ))}
          </div>

          {/* No results message */}
          {filteredChapters.length === 0 && <p className="text-gray-500 text-center py-8">Tidak ada chapter yang cocok dengan "{searchQuery}"</p>}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">Belum ada chapter tersedia</p>
      )}
    </div>
  );
}

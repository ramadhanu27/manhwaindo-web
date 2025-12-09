"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { extractSeriesSlug, encodeSlug } from "@/lib/slug-utils";

interface Chapter {
  title: string;
  slug: string;
  time?: string;
}

interface ChapterNavigationProps {
  currentChapter: string;
  chapters: Chapter[];
  seriesSlug: string;
  prevChapter?: string;
  nextChapter?: string;
}

export default function ChapterNavigation({ currentChapter, chapters, seriesSlug, prevChapter, nextChapter }: ChapterNavigationProps) {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(currentChapter);

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChapter = e.target.value;
    setSelectedChapter(newChapter);
    router.push(`/series/${encodeSlug(seriesSlug)}/${encodeSlug(newChapter)}`);
  };

  // Find current chapter title for display
  const currentChapterData = chapters.find((ch) => extractSeriesSlug(ch.slug) === currentChapter);
  const currentTitle = currentChapterData?.title || currentChapter.replace(/-/g, " ");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Chapter Dropdown */}
      <div className="relative">
        <select
          value={selectedChapter}
          onChange={handleChapterChange}
          className="appearance-none bg-[#2a3142] border border-gray-700 text-white px-4 py-2.5 pr-10 rounded-lg focus:outline-none focus:border-green-500 cursor-pointer min-w-[160px]">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <option key={chapter.slug} value={extractSeriesSlug(chapter.slug)}>
                {chapter.title}
              </option>
            ))
          ) : (
            <option value={currentChapter}>{currentTitle}</option>
          )}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        {/* All Chapters Button */}
        <Link href={`/series/${encodeSlug(seriesSlug)}`} className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          All
        </Link>

        {/* Prev Button */}
        {prevChapter ? (
          <Link
            href={`/series/${encodeSlug(seriesSlug)}/${encodeSlug(extractSeriesSlug(prevChapter))}`}
            className="px-4 py-2.5 bg-[#2a3142] border border-gray-700 hover:border-green-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </Link>
        ) : (
          <button disabled className="px-4 py-2.5 bg-[#2a3142] border border-gray-700 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
        )}

        {/* Next Button */}
        {nextChapter ? (
          <Link
            href={`/series/${encodeSlug(seriesSlug)}/${encodeSlug(extractSeriesSlug(nextChapter))}`}
            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <button disabled className="px-4 py-2.5 bg-[#2a3142] border border-gray-700 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-1">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { extractSeriesSlug, encodeSlug } from '@/lib/slug-utils';

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

export default function ChaptersSection({
  chapters,
  seriesSlug,
  seriesTitle,
}: ChaptersSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time search filter
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;

    return chapters.filter((chapter) => {
      const query = searchQuery.toLowerCase();
      return (
        chapter.title.toLowerCase().includes(query) ||
        chapter.slug.toLowerCase().includes(query)
      );
    });
  }, [chapters, searchQuery]);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Chapter {seriesTitle}</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Chapter. Example: 25 or 178"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Chapters List with Scroll */}
      {chapters && chapters.length > 0 ? (
        <div className="max-h-[600px] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredChapters.map((chapter: any, idx: number) => (
              <Link
                key={idx}
                href={`/series/${encodeSlug(seriesSlug)}/${encodeSlug(extractSeriesSlug(chapter.slug))}`}
                className="block p-4 bg-background border border-border rounded-lg hover:border-primary/50 hover:bg-background/80 transition-all group"
              >
                <div className="font-medium text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {chapter.title}
                </div>
                {chapter.time && (
                  <div className="text-xs text-muted-foreground">{chapter.time}</div>
                )}
              </Link>
            ))}
          </div>

          {/* No results message */}
          {filteredChapters.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No chapters found matching "{searchQuery}"
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No chapters available</p>
      )}
    </div>
  );
}

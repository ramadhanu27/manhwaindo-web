'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSeriesDetail } from '@/lib/api';

interface SearchListItemProps {
  item: any;
}

export default function SearchListItem({ item }: SearchListItemProps) {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const result = await getSeriesDetail(item.slug);
      if (result.success && result.data) {
        setDetail(result.data);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [item.slug]);

  const synopsis = detail?.synopsis || item.synopsis || '';
  const views = detail?.views || item.views || '';
  const rating = detail?.rating || item.rating || '';

  return (
    <Link
      href={`/series/${encodeURIComponent(item.slug.replace(/\/+$/, '').trim())}`}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-background/50 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-16 sm:w-16 sm:h-24 rounded overflow-hidden bg-muted flex-shrink-0">
        {item.type && (
          <span className="absolute top-0.5 left-0.5 bg-purple-600 text-white px-1.5 py-0.5 text-[6px] sm:text-[8px] font-bold rounded">
            {item.type.charAt(0)}
          </span>
        )}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">
          {item.title}
        </h3>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
          {item.type && (
            <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs font-medium">
              {item.type}
            </span>
          )}
          {rating && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-500">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
          )}
          {views && (
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-400">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              {views}
            </span>
          )}
        </div>

        {/* Synopsis */}
        {synopsis && !loading && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {synopsis}
          </p>
        )}
        {loading && (
          <div className="text-xs text-muted-foreground mt-2 animate-pulse">
            Loading...
          </div>
        )}

        {/* Chapters List */}
        {item.chapters && item.chapters.length > 0 && (
          <div className="mt-2 space-y-1">
            {item.chapters.slice(0, 2).map((chapter: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-foreground group-hover:text-primary transition-colors truncate flex-1">
                  {chapter.title}
                </span>
                <span className="text-muted-foreground ml-2 flex-shrink-0">
                  {chapter.time}
                </span>
              </div>
            ))}
            {item.chapters.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{item.chapters.length - 2} more chapters
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

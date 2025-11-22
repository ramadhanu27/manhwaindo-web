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
  const status = detail?.status || item.status || '';
  const type = detail?.type || item.type || '';
  const chapters = detail?.chapters || item.chapters || [];

  // Helper function to clean slugs
  const cleanSlug = (slug: string) => slug.replace(/\/+$/, '').trim();

  // Helper function to get badge color based on type
  const getTypeBadgeColor = (type?: string) => {
    if (!type) return 'bg-gray-600';
    const typeUpper = type.toUpperCase();
    if (typeUpper.includes('MANHWA')) return 'bg-purple-600';
    if (typeUpper.includes('MANGA')) return 'bg-blue-600';
    if (typeUpper.includes('MANHUA')) return 'bg-orange-600';
    return 'bg-gray-600';
  };

  return (
    <Link
      href={`/series/${cleanSlug(item.slug)}`}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-background/50 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-24 sm:w-20 sm:h-32 rounded overflow-hidden bg-muted flex-shrink-0">
        {type && (
          <span className={`absolute top-0.5 left-0.5 ${getTypeBadgeColor(type)} text-white px-2 py-1 text-[7px] sm:text-[9px] font-bold rounded`}>
            {type.substring(0, 1).toUpperCase()}
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
          {type && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getTypeBadgeColor(type)}`}>
              {type}
            </span>
          )}
          {status && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              status.toLowerCase().includes('ongoing') 
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-gray-600/20 text-gray-400'
            }`}>
              {status}
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
        {chapters && chapters.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {chapters.slice(0, 2).map((chapter: any, index: number) => (
              <div key={index} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-foreground group-hover:text-primary transition-colors truncate flex-1 leading-tight">
                  {chapter.title}
                </span>
                <div className="flex-shrink-0 whitespace-nowrap text-right">
                  <span className="text-muted-foreground text-[11px]">
                    {chapter.time}
                  </span>
                </div>
              </div>
            ))}
            {chapters.length > 2 && (
              <div className="text-xs text-muted-foreground pt-1">
                +{chapters.length - 2} more chapters
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

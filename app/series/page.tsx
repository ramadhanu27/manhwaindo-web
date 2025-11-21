'use client';

import { useState, useEffect, use } from 'react';
import { getLatest } from '@/lib/api';
import SeriesCard from '@/components/SeriesCard';
import ViewToggle from '@/components/ViewToggle';
import Link from 'next/link';

export default function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; order?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const [page, setPage] = useState(parseInt(resolvedSearchParams.page || '1'));
  const [view, setView] = useState<'grid' | 'list' | 'compact'>('grid');
  const [data, setData] = useState<any>({ success: false, data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getLatest(page);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [page]);

  // Update page state when searchParams changes
  useEffect(() => {
    const newPage = parseInt(resolvedSearchParams.page || '1');
    if (newPage !== page) {
      setPage(newPage);
    }
  }, [resolvedSearchParams.page]);
  
  // Deduplicate series by slug
  const seriesMap = new Map();
  if (data.success && data.data) {
    data.data.forEach((item: any) => {
      if (!seriesMap.has(item.slug)) {
        seriesMap.set(item.slug, item);
      }
    });
  }
  const series = Array.from(seriesMap.values());

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading series...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Series</h1>
          <p className="text-muted-foreground">
            Browse our complete collection of manhwa series
          </p>
        </div>
        <ViewToggle onViewChange={setView} />
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {series.map((item: any) => (
            <SeriesCard
              key={item.slug}
              title={item.title}
              slug={item.slug}
              image={item.image}
              type={item.type}
              rating={item.rating}
              latestChapter={item.chapters?.[0]?.title}
              chapters={item.chapters}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-3 mb-8">
          {series.slice(0, 12).map((item: any) => (
            <Link
              key={item.slug}
              href={`/series/${encodeURIComponent(item.slug.replace(/\/+$/, '').trim())}`}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-background/50 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-24 rounded overflow-hidden bg-muted flex-shrink-0">
                {item.type && (
                  <span className="absolute top-0.5 left-0.5 bg-purple-600 text-white px-1.5 py-0.5 text-[8px] font-bold rounded">
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
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  {item.type && (
                    <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs font-medium">
                      {item.type}
                    </span>
                  )}
                  {item.rating && (
                    <>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-500">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {item.rating}
                      </span>
                    </>
                  )}
                </div>
                {/* Chapters List */}
                {item.chapters && item.chapters.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {item.chapters.slice(0, 3).map((chapter: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {chapter.title}
                        </span>
                        <span className="text-muted-foreground">
                          {chapter.time}
                        </span>
                      </div>
                    ))}
                    {item.chapters.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{item.chapters.length - 3} more chapters
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Compact View */}
      {view === 'compact' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 mb-8">
          {series.map((item: any) => (
            <Link
              key={item.slug}
              href={`/series/${encodeURIComponent(item.slug.replace(/\/+$/, '').trim())}`}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded overflow-hidden bg-muted">
                {item.type && (
                  <span className="absolute top-1 left-1 bg-purple-600 text-white px-1 py-0.5 text-[6px] font-bold rounded z-10">
                    {item.type.charAt(0)}
                  </span>
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-foreground mt-1 truncate group-hover:text-primary transition-colors">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 flex-wrap">
        {page > 1 && (
          <Link
            href={`/series?page=${page - 1}`}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            Previous
          </Link>
        )}
        
        {/* Page Numbers */}
        <div className="flex gap-1">
          {/* Always show page 1 */}
          {page !== 1 && (
            <Link
              href={`/series?page=1`}
              className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
            >
              1
            </Link>
          )}
          
          {/* Show current page */}
          <span className="px-3 py-2 bg-primary border border-primary text-primary-foreground rounded-lg text-sm">
            {page}
          </span>
          
          {/* Show next few pages */}
          {page < 5 && [page + 1, page + 2, page + 3, page + 4].slice(0, 4 - (page - 1)).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/series?page=${pageNum}`}
              className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
            >
              {pageNum}
            </Link>
          ))}
          
          {/* Show ellipsis and last page */}
          {page < 50 && (
            <>
              <span className="px-2 py-2 text-muted-foreground">...</span>
              <Link
                href={`/series?page=200`}
                className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
              >
                200
              </Link>
            </>
          )}
          
          {/* If we're near the end, show last few pages */}
          {page >= 50 && page < 195 && (
            <>
              <span className="px-2 py-2 text-muted-foreground">...</span>
              {[page - 1, page + 1, page + 2].map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/series?page=${pageNum}`}
                  className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
                >
                  {pageNum}
                </Link>
              ))}
              <span className="px-2 py-2 text-muted-foreground">...</span>
              <Link
                href={`/series?page=200`}
                className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
              >
                200
              </Link>
            </>
          )}
          
          {/* If we're at the very end */}
          {page >= 195 && page < 200 && (
            <>
              <span className="px-2 py-2 text-muted-foreground">...</span>
              {[196, 197, 198, 199].map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/series?page=${pageNum}`}
                  className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
                >
                  {pageNum}
                </Link>
              ))}
            </>
          )}
        </div>
        
        <Link
          href={`/series?page=${page + 1}`}
          className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
        >
          Next
        </Link>
      </div>
    </div>
  );
}

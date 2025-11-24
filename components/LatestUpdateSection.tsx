'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ViewToggle from './ViewToggle';

interface LatestUpdateSectionProps {
  series: any[];
}

const cleanSlug = (slug: string) => slug.replace(/\/+$/, '').trim();

export default function LatestUpdateSection({ series }: LatestUpdateSectionProps) {
  const [view, setView] = useState<'grid' | 'list' | 'compact'>('grid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Update</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.slice(0, 12).map((item: any) => (
            <div key={item.slug} className="bg-card border border-border rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Latest Update</h2>
        <div className="flex items-center gap-4">
          <ViewToggle onViewChange={setView} />
          <Link 
            href="/series?order=update" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded text-sm font-semibold transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
      
      {view === 'grid' && (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.slice(0, 12).map((item: any) => (
            <div key={item.slug} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <Link href={`/series/${encodeURIComponent(cleanSlug(item.slug))}`} className="flex-shrink-0">
                  <div className="relative w-20 h-28 rounded overflow-hidden bg-muted">
                    {item.type && (
                      <span className="absolute top-0.5 left-0.5 bg-purple-600 text-white px-1.5 py-0.5 text-[9px] font-bold rounded">
                        {item.type.charAt(0)}
                      </span>
                    )}
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/series/${encodeURIComponent(cleanSlug(item.slug))}`}>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  
                  {/* Chapters */}
                  <div className="space-y-1">
                    {item.chapters && item.chapters.slice(0, 3).map((chapter: any, idx: number) => (
                      <Link
                        key={idx}
                        href={`/series/${encodeURIComponent(cleanSlug(item.slug))}/${encodeURIComponent(cleanSlug(chapter.slug))}`}
                        className="flex items-center justify-between text-xs hover:text-primary transition-colors group"
                      >
                        <span className="text-muted-foreground group-hover:text-primary truncate">
                          {chapter.title}
                        </span>
                        <span className="text-muted-foreground/60 text-[10px] ml-2 flex-shrink-0">
                          {chapter.time || 'baru'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'list' && (
        // List View
        <div className="space-y-3">
          {series.slice(0, 12).map((item: any) => (
            <Link
              key={item.slug}
              href={`/series/${encodeURIComponent(cleanSlug(item.slug))}`}
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
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                {item.chapters && item.chapters.length > 0 && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    Latest: {item.chapters[0].title}
                  </p>
                )}
              </div>

              {/* Latest Chapter Time */}
              {item.chapters && item.chapters.length > 0 && (
                <span className="text-sm text-muted-foreground/60 flex-shrink-0 whitespace-nowrap">
                  {item.chapters[0].time || 'baru'}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {view === 'compact' && (
        // Compact View
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {series.slice(0, 12).map((item: any) => (
            <Link
              key={item.slug}
              href={`/series/${encodeURIComponent(cleanSlug(item.slug))}`}
              className="group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all">
                {item.type && (
                  <span className="absolute top-1 left-1 bg-purple-600 text-white px-1.5 py-0.5 text-[8px] font-bold rounded z-10">
                    {item.type.charAt(0)}
                  </span>
                )}
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-xs font-semibold mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

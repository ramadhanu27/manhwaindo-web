'use client';

import { useState, useEffect, use } from 'react';
import { getSeriesList } from '@/lib/api';
import SeriesCard from '@/components/SeriesCard';
import SearchGridView from '@/components/SearchGridView';
import SearchListView from '@/components/SearchListView';
import SearchFilters from '@/components/SearchFilters';
import SearchListItem from '@/components/SearchListItem';
import ViewToggle from '@/components/ViewToggle';
import Link from 'next/link';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; order?: string; type?: string; status?: string; genre?: string; title?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const { page: pageParam, order, type, status, genre, title } = resolvedSearchParams;
  const [page, setPage] = useState(parseInt(pageParam || '1'));
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [data, setData] = useState<any>({ success: false, data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Always use series-list API
      const filters: any = {};
      if (order) filters.order = order;
      if (type) filters.type = type;
      if (status) filters.status = status;
      if (genre) filters.genre = genre;
      
      console.log(`Using series-list API: /api/series-list?page=${page}`, filters);
      const result = await getSeriesList(page, filters);
      console.log('Series-list results:', result);
      
      setData(result);
      setLoading(false);
    };
    
    fetchData();
  }, [page, order, type, status, genre]);

  // Update page state when searchParams changes
  useEffect(() => {
    const newPage = parseInt(pageParam || '1');
    if (newPage !== page) {
      setPage(newPage);
    }
  }, [pageParam]);

  const results = data.success ? data.data : [];
  console.log('Final results:', results);

  // Build query string for filters
  const buildQueryString = (newParams: any) => {
    const params = new URLSearchParams();
    if (newParams.page) params.append('page', newParams.page);
    if (newParams.order || order) params.append('order', newParams.order || order);
    if (newParams.type || type) params.append('type', newParams.type || type);
    if (newParams.status || status) params.append('status', newParams.status || status);
    if (newParams.genre || genre) params.append('genre', newParams.genre || genre);
    return `?${params.toString()}`;
  };

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Manhwa</h1>
        <p className="text-muted-foreground">
          {results.length > 0
            ? `Found ${results.length} series`
            : 'Browse and filter manhwa series'}
        </p>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Filters */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-8">
            <SearchFilters title={title} order={order} type={type} status={status} genre={genre} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* View Toggle */}
          <div className="flex justify-end mb-4 lg:mb-6">
            <ViewToggle onViewChange={setView} />
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <>
              {/* Grid View */}
              {view === 'grid' && <SearchGridView results={results} />}

              {/* List View */}
              {view === 'list' && <SearchListView results={results} />}

              {/* Pagination */}
              <div className="flex justify-center gap-2 flex-wrap">
                  {page > 1 && (
                    <Link
                      href={`/search${buildQueryString({ page: page - 1 })}`}
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
                        href={`/search${buildQueryString({ page: 1 })}`}
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
                        href={`/search${buildQueryString({ page: pageNum })}`}
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
                          href={`/search${buildQueryString({ page: 200 })}`}
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
                            href={`/search${buildQueryString({ page: pageNum })}`}
                            className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
                          >
                            {pageNum}
                          </Link>
                        ))}
                        <span className="px-2 py-2 text-muted-foreground">...</span>
                        <Link
                          href={`/search${buildQueryString({ page: 200 })}`}
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
                            href={`/search${buildQueryString({ page: pageNum })}`}
                            className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm"
                          >
                            {pageNum}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                  
                  {results.length > 0 && (
                    <Link
                      href={`/search${buildQueryString({ page: page + 1 })}`}
                      className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                    >
                      Next
                    </Link>
                  )}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Use the filters above to browse manhwa series</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

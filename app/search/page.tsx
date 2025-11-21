import { searchSeries, getSeriesList } from '@/lib/api';
import SeriesCard from '@/components/SeriesCard';
import SearchFilters from '@/components/SearchFilters';
import Link from 'next/link';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; order?: string; type?: string; status?: string; genre?: string; title?: string }>;
}) {
  const { q, page: pageParam, order, type, status, genre, title } = await searchParams;
  const query = q || '';
  const page = parseInt(pageParam || '1');
  
  // If query is provided, use search API; otherwise use series-list API with filters
  let data;
  if (query) {
    console.log('Searching with query:', query);
    data = await searchSeries(query);
    console.log('Search results:', data);
  } else {
    // Use series-list API with filters
    const filters: any = {};
    if (title) filters.title = title;
    if (order) filters.order = order;
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (genre) filters.genre = genre;
    
    console.log('Using series-list with filters:', filters);
    data = await getSeriesList(page, filters);
    console.log('Series-list results:', data);
  }
  
  const results = data.success ? data.data : [];
  console.log('Final results:', results);

  // Build query string for filters
  const buildQueryString = (newParams: any) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (newParams.page) params.append('page', newParams.page);
    if (newParams.order || order) params.append('order', newParams.order || order);
    if (newParams.type || type) params.append('type', newParams.type || type);
    if (newParams.status || status) params.append('status', newParams.status || status);
    if (newParams.genre || genre) params.append('genre', newParams.genre || genre);
    return `?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search Results for "${query}"` : 'Browse Manhwa'}
        </h1>
        <p className="text-muted-foreground">
          {results.length > 0
            ? `Found ${results.length} results`
            : query
            ? 'No results found'
            : 'Browse and filter manhwa series'}
        </p>
      </div>

      {/* Filter Section */}
      {!query && (
        <SearchFilters title={title} order={order} type={type} status={status} genre={genre} />
      )}

      {results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {results.map((series: any) => (
              <SeriesCard
                key={series.slug}
                title={series.title}
                slug={series.slug}
                image={series.image}
                type={series.type}
                rating={series.rating}
              />
            ))}
          </div>

          {/* Pagination - Only show for filtered view, not search */}
          {!query && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/search${buildQueryString({ page: page - 1 })}`}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                Page {page}
              </span>
              {results.length > 0 && (
                <Link
                  href={`/search${buildQueryString({ page: page + 1 })}`}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : query ? (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-muted-foreground mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-xl text-muted-foreground mb-2">No manhwa found matching "{query}"</p>
          <p className="text-sm text-muted-foreground">Try searching with different keywords or use the filters below</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">Use the filters above to browse manhwa series</p>
        </div>
      )}
    </div>
  );
}

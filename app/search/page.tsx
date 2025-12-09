"use client";

import { useState, useEffect, use } from "react";
import SeriesCard from "@/components/SeriesCard";
import SearchGridView from "@/components/SearchGridView";
import SearchListView from "@/components/SearchListView";
import SearchFilters from "@/components/SearchFilters";
import SearchListItem from "@/components/SearchListItem";
import ViewToggle from "@/components/ViewToggle";
import Link from "next/link";

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; order?: string; type?: string; status?: string; genre?: string; title?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const { page: pageParam, order, type, status, genre, title } = resolvedSearchParams;
  const [page, setPage] = useState(parseInt(pageParam || "1"));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [data, setData] = useState<any>({ success: false, data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let url: string;

        // If title is provided, use search API
        if (title) {
          url = `https://rdapi.vercel.app/api/search?q=${encodeURIComponent(title)}`;
          console.log("Using search API:", url);
        } else {
          // Otherwise use series-list API with filters
          const params = new URLSearchParams();
          params.append("page", page.toString());

          if (order) params.append("order", order);
          if (type) params.append("type", type);
          if (status) params.append("status", status);
          if (genre) params.append("genre", genre);

          url = `https://rdapi.vercel.app/api/series-list?${params.toString()}`;
          console.log("Using series-list API:", url);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch series");

        const result = await response.json();
        console.log("Search results:", result);

        setData(result);
      } catch (error) {
        console.error("Error fetching series:", error);
        setData({ success: false, data: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, order, type, status, genre, title]);

  // Update page state when searchParams changes
  useEffect(() => {
    const newPage = parseInt(pageParam || "1");
    if (newPage !== page) {
      setPage(newPage);
    }
  }, [pageParam]);

  const results = data.success ? data.data : [];
  console.log("Final results:", results);

  // Build query string for filters
  const buildQueryString = (newParams: any) => {
    const params = new URLSearchParams();
    if (newParams.page) params.append("page", newParams.page);
    if (newParams.order || order) params.append("order", newParams.order || order);
    if (newParams.type || type) params.append("type", newParams.type || type);
    if (newParams.status || status) params.append("status", newParams.status || status);
    if (newParams.genre || genre) params.append("genre", newParams.genre || genre);
    return `?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1319]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="relative w-12 h-12 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400">Loading series...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1319]">
      <div className="container mx-auto px-4 py-6">
        {/* Main Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <SearchFilters title={title} order={order} type={type} status={status} genre={genre} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  📚 Hasil Pencarian
                  {results.length > 0 && <span className="text-sm font-normal text-gray-300">({results.length} series)</span>}
                </h2>
                <ViewToggle onViewChange={setView} />
              </div>

              <div className="p-4">
                {/* Results */}
                {results.length > 0 ? (
                  <>
                    {/* Grid View */}
                    {view === "grid" && <SearchGridView results={results} />}

                    {/* List View */}
                    {view === "list" && <SearchListView results={results} />}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400">Gunakan filter di samping untuk mencari manhwa</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {results.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                {page > 1 && (
                  <Link href={`/search${buildQueryString({ page: page - 1 })}`} className="px-4 py-2 bg-[#2a3142] border border-gray-700 hover:border-green-500 text-white rounded-lg transition-colors">
                    Previous
                  </Link>
                )}

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {/* Always show page 1 */}
                  {page !== 1 && (
                    <Link href={`/search${buildQueryString({ page: 1 })}`} className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm">
                      1
                    </Link>
                  )}

                  {/* Show current page */}
                  <span className="px-3 py-2 bg-green-500 border border-green-500 text-white rounded-lg text-sm">{page}</span>

                  {/* Show next few pages */}
                  {page < 5 &&
                    [page + 1, page + 2, page + 3, page + 4].slice(0, 4 - (page - 1)).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/search${buildQueryString({ page: pageNum })}`}
                        className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm">
                        {pageNum}
                      </Link>
                    ))}

                  {/* Show ellipsis and last page */}
                  {page < 50 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      <Link
                        href={`/search${buildQueryString({ page: 200 })}`}
                        className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm">
                        200
                      </Link>
                    </>
                  )}

                  {/* If we're near the end, show last few pages */}
                  {page >= 50 && page < 195 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      {[page - 1, page + 1, page + 2].map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/search${buildQueryString({ page: pageNum })}`}
                          className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm">
                          {pageNum}
                        </Link>
                      ))}
                      <span className="px-2 py-2 text-gray-500">...</span>
                      <Link
                        href={`/search${buildQueryString({ page: 200 })}`}
                        className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm">
                        200
                      </Link>
                    </>
                  )}

                  {/* If we're at the very end */}
                  {page >= 195 && page < 200 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      {[196, 197, 198, 199].map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/search${buildQueryString({ page: pageNum })}`}
                          className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm">
                          {pageNum}
                        </Link>
                      ))}
                    </>
                  )}
                </div>

                {results.length > 0 && (
                  <Link href={`/search${buildQueryString({ page: page + 1 })}`} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

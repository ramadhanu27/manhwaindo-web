"use client";

import { useState, useEffect } from "react";
import { generatePDF, generateZIP, downloadBlob } from "@/lib/download-utils";
import { getSeriesList, getSeriesDetail, getChapterImages } from "@/lib/api";
import { isFavorite, addToFavorites, removeFromFavorites, isChapterBookmarked, addBookmark, removeBookmark } from "@/lib/bookmark-storage";

interface Chapter {
  slug: string;
  title: string;
  time?: string;
}

interface SeriesDetail {
  title: string;
  slug: string;
  image: string;
  rating?: string;
  status?: string;
  synopsis?: string;
  genres?: string[];
  chapters: Chapter[];
}

interface ChapterImages {
  slug: string;
  title: string;
  images: string[];
}

type Step = "search" | "detail";

export default function DownloadFlow() {
  const [step, setStep] = useState<Step>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [seriesDetail, setSeriesDetail] = useState<SeriesDetail | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
    status: string;
  } | null>(null);
  const [isFav, setIsFav] = useState(false);

  // Fetch series list on component mount and when page/submitted search changes
  useEffect(() => {
    const fetchSeriesList = async () => {
      setLoading(true);
      setError("");
      try {
        const filters: any = {};
        if (submittedSearchQuery.trim()) {
          filters.title = submittedSearchQuery;
        }

        const data = await getSeriesList(currentPage, filters);
        if (data.success) {
          setSearchResults(data.data || []);
        } else {
          throw new Error("Failed to load series list");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load series list. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesList();
  }, [currentPage, submittedSearchQuery]);

  // Handle search submit (not realtime)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  // Step 2: View Series Detail
  const handleSelectSeries = async (seriesSlug: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getSeriesDetail(seriesSlug);
      if (data.success && data.data) {
        setSeriesDetail(data.data);
        setSelectedChapters(new Set());
        setStep("detail");
      } else {
        throw new Error("Failed to load series detail");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load series detail. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check favorite status when series detail loads
  useEffect(() => {
    if (seriesDetail) {
      setIsFav(isFavorite(seriesDetail.slug));
    }
  }, [seriesDetail]);

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!seriesDetail) return;

    if (isFav) {
      removeFromFavorites(seriesDetail.slug);
      setIsFav(false);
    } else {
      addToFavorites({
        slug: seriesDetail.slug,
        title: seriesDetail.title,
        image: seriesDetail.image,
      });
      setIsFav(true);
    }
  };

  // Go back to search
  const handleBack = () => {
    setStep("search");
    setSeriesDetail(null);
    setSelectedChapters(new Set());
  };

  // Step 3: Toggle Chapter Selection
  const handleChapterToggle = (chapterSlug: string) => {
    const cleanSlug = chapterSlug.replace(/\/+$/, "").trim();
    const newSelected = new Set(selectedChapters);
    if (newSelected.has(cleanSlug)) {
      newSelected.delete(cleanSlug);
    } else {
      newSelected.add(cleanSlug);
    }
    setSelectedChapters(newSelected);
  };

  // Select/Deselect All
  const handleSelectAll = () => {
    if (!seriesDetail) return;
    if (selectedChapters.size === seriesDetail.chapters.length) {
      setSelectedChapters(new Set());
    } else {
      const allChapters = new Set(seriesDetail.chapters.map((ch) => ch.slug.replace(/\/+$/, "").trim()));
      setSelectedChapters(allChapters);
    }
  };

  // Download single chapter as PDF (client-side generation for Netlify compatibility)
  const handleDownloadChapter = async (chapterSlug: string) => {
    if (!seriesDetail) return;

    try {
      setError("");
      setDownloadProgress({
        current: 0,
        total: 100,
        status: "Memuat chapter...",
      });

      const data = await getChapterImages(chapterSlug);

      if (!data.success) {
        throw new Error(data.error || "Failed to load chapter images");
      }

      // Allow download even if some images fail (will use placeholder)
      if (!data.data?.images || data.data.images.length === 0) {
        console.warn("No images found, but attempting download anyway...");
        // Don't throw error, let it proceed with placeholders
      }

      const foundChapter = seriesDetail.chapters.find((ch) => ch.slug.replace(/\/+$/, "").trim() === chapterSlug);

      setDownloadProgress({
        current: 10,
        total: 100,
        status: `Downloading ${data.data.images.length} images...`,
      });

      // Use client-side PDF generation
      const { generatePDFInBrowser } = await import("@/lib/pdf-client");

      const blob = await generatePDFInBrowser(data.data.images, (current, total, status) => {
        const progress = 10 + (current / total) * 80;
        setDownloadProgress({
          current: progress,
          total: 100,
          status,
        });
      });

      setDownloadProgress({
        current: 95,
        total: 100,
        status: "Saving PDF...",
      });

      downloadBlob(blob, `${seriesDetail.title} - ${foundChapter?.title || "Chapter"}.pdf`);

      setDownloadProgress({
        current: 100,
        total: 100,
        status: "✓ Download complete!",
      });

      setTimeout(() => {
        setDownloadProgress(null);
      }, 2000);
    } catch (err) {
      setDownloadProgress(null);
      const errorMessage = err instanceof Error ? err.message : "Download failed. Please try again.";
      setError(errorMessage);
      console.error("Download error:", err);
    }
  };

  // Download multiple chapters as ZIP with PDFs (direct download)
  const handleDownloadMultiple = async () => {
    if (!seriesDetail || selectedChapters.size === 0) {
      setError("Please select at least one chapter");
      return;
    }

    try {
      setError("");
      setDownloadProgress({
        current: 0,
        total: 100,
        status: "Memulai download...",
      });

      // Fetch chapter images
      const chapterData: ChapterImages[] = [];
      const selectedChapterArray = Array.from(selectedChapters);
      const totalChapters = selectedChapterArray.length;
      const failedChapters: string[] = [];

      for (let i = 0; i < selectedChapterArray.length; i++) {
        const chapterSlug = selectedChapterArray[i];
        setDownloadProgress({
          current: (i / totalChapters) * 20,
          total: 100,
          status: `Memuat chapter ${i + 1}/${totalChapters}...`,
        });

        try {
          const data = await getChapterImages(chapterSlug);

          if (data.success && data.data?.images && data.data.images.length > 0) {
            const foundChapter = seriesDetail.chapters.find((ch) => ch.slug.replace(/\/+$/, "").trim() === chapterSlug);

            chapterData.push({
              slug: chapterSlug,
              title: foundChapter?.title || data.data.title || "Chapter",
              images: data.data.images,
            });
          } else {
            const foundChapter = seriesDetail.chapters.find((ch) => ch.slug.replace(/\/+$/, "").trim() === chapterSlug);
            failedChapters.push(foundChapter?.title || chapterSlug);
            console.warn(`Chapter ${chapterSlug} has no images or failed to load`);
          }
        } catch (err) {
          const foundChapter = seriesDetail.chapters.find((ch) => ch.slug.replace(/\/+$/, "").trim() === chapterSlug);
          failedChapters.push(foundChapter?.title || chapterSlug);
          console.error(`Error fetching chapter ${chapterSlug}:`, err);
        }
      }

      if (chapterData.length === 0) {
        throw new Error(`No chapter images found. ${failedChapters.length > 0 ? `Failed chapters: ${failedChapters.join(", ")}` : "Please try again."}`);
      }

      // Show warning if some chapters failed
      if (failedChapters.length > 0) {
        console.warn(`${failedChapters.length} chapter(s) failed to load:`, failedChapters);
      }

      setDownloadProgress({
        current: 25,
        total: 100,
        status: `Membuat PDF untuk ${chapterData.length} chapter...`,
      });

      // If only 1 chapter, download as PDF (client-side)
      if (chapterData.length === 1) {
        const { generatePDFInBrowser } = await import("@/lib/pdf-client");

        const blob = await generatePDFInBrowser(chapterData[0].images, (current, total, status) => {
          const progress = 25 + (current / total) * 65;
          setDownloadProgress({
            current: progress,
            total: 100,
            status,
          });
        });

        setDownloadProgress({
          current: 95,
          total: 100,
          status: "Saving PDF...",
        });

        downloadBlob(blob, `${seriesDetail.title} - ${chapterData[0].title}.pdf`);

        setDownloadProgress({
          current: 100,
          total: 100,
          status: "✓ Download selesai!",
        });

        setTimeout(() => {
          setDownloadProgress(null);
        }, 2000);
      } else {
        // If 2+ chapters, create ZIP with individual PDFs (client-side)
        const JSZip = (await import("jszip")).default;
        const { generatePDFInBrowser } = await import("@/lib/pdf-client");
        const zip = new JSZip();

        for (let i = 0; i < chapterData.length; i++) {
          const chapter = chapterData[i];

          setDownloadProgress({
            current: 25 + (i / chapterData.length) * 60,
            total: 100,
            status: `Creating PDF ${i + 1}/${chapterData.length}...`,
          });

          try {
            const blob = await generatePDFInBrowser(chapter.images);
            zip.file(`${i + 1}. ${chapter.title}.pdf`, blob);
          } catch (error) {
            console.error(`Failed to generate PDF for ${chapter.title}:`, error);
          }
        }

        setDownloadProgress({
          current: 90,
          total: 100,
          status: "Membuat file ZIP...",
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${seriesDetail.title}.zip`);

        setDownloadProgress({
          current: 100,
          total: 100,
          status: `✓ Download selesai! ${failedChapters.length > 0 ? `(${failedChapters.length} chapter gagal)` : ""}`,
        });

        setTimeout(() => {
          setDownloadProgress(null);
          if (failedChapters.length > 0) {
            setError(`Warning: ${failedChapters.length} chapter(s) failed to download: ${failedChapters.join(", ")}`);
          }
        }, 3000);
      }
    } catch (err) {
      setDownloadProgress(null);
      const errorMessage = err instanceof Error ? err.message : "Download failed. Please try again.";
      setError(errorMessage);
      console.error("Download error:", err);
    }
  };

  if (loading && step === "search") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-green-400">Loading series...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1319]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Download Manhwa</h1>
            <p className="text-gray-400">Pilih series dan chapter untuk didownload dalam format PDF atau ZIP</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex gap-3 items-start">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Oops! Terjadi kesalahan</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Browse Series */}
        {step === "search" && (
          <>
            {/* Search Input */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
                <h2 className="text-lg font-bold text-white">Cari Series</h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari series manhwa..."
                    className="flex-1 px-4 py-3 bg-[#2a3142] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button type="submit" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Cari
                  </button>
                </form>
              </div>
            </div>

            {/* Series Grid */}
            {searchResults.length > 0 && (
              <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
                <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
                  <h2 className="text-lg font-bold text-white">Daftar Series</h2>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.map((result) => (
                    <button
                      key={result.slug}
                      onClick={() => handleSelectSeries(result.slug)}
                      disabled={loading}
                      className="group relative overflow-hidden rounded-lg bg-[#2a3142] border border-gray-700 hover:border-green-500 transition-all hover:ring-2 hover:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-left">
                      {/* Image Container */}
                      <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
                        <img src={result.image || "/placeholder.jpg"} alt={result.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                        {/* Rating Badge */}
                        {result.rating && (
                          <div className="absolute top-2 right-2 bg-yellow-500/90 backdrop-blur-sm rounded px-2 py-1 shadow-lg">
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                                <path
                                  fillRule="evenodd"
                                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs font-bold text-white">{result.rating}</span>
                            </div>
                          </div>
                        )}

                        {/* Type Badge */}
                        {result.type && <span className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-0.5 text-xs font-bold rounded">{result.type.charAt(0).toUpperCase()}</span>}
                      </div>

                      {/* Info Section */}
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-green-400 transition-colors">{result.title}</h3>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {searchResults.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={loading}
                    className="px-4 py-2 bg-[#2a3142] border border-gray-700 hover:border-green-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                )}

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {/* Always show page 1 */}
                  {currentPage !== 1 && (
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={loading}
                      className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      1
                    </button>
                  )}

                  {/* Show current page */}
                  <span className="px-3 py-2 bg-green-500 border border-green-500 text-white rounded-lg text-sm">{currentPage}</span>

                  {/* Show next few pages */}
                  {currentPage < 5 &&
                    [currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4].slice(0, 4 - (currentPage - 1)).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className="px-3 py-2 bg-[#2a3142] border border-gray-700 hover:bg-green-500 hover:text-white hover:border-green-500 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {pageNum}
                      </button>
                    ))}

                  {/* Show ellipsis and last page */}
                  {currentPage < 50 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(200)}
                        disabled={loading}
                        className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        200
                      </button>
                    </>
                  )}

                  {/* If we're near the end, show last few pages */}
                  {currentPage >= 50 && currentPage < 195 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      {[currentPage - 1, currentPage + 1, currentPage + 2].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                          {pageNum}
                        </button>
                      ))}
                      <span className="px-2 py-2 text-gray-500">...</span>
                      <button
                        onClick={() => setCurrentPage(200)}
                        disabled={loading}
                        className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        200
                      </button>
                    </>
                  )}

                  {/* If we're at the very end */}
                  {currentPage >= 195 && currentPage < 200 && (
                    <>
                      <span className="px-2 py-2 text-gray-500">...</span>
                      {[196, 197, 198, 199].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                          {pageNum}
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Next Button */}
                {searchResults.length > 0 && (
                  <button
                    onClick={() => setCurrentPage(Math.min(200, currentPage + 1))}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                )}
              </div>
            )}

            {searchResults.length === 0 && !loading && (
              <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-400 font-medium">Tidak ada series yang tersedia</p>
              </div>
            )}
          </>
        )}

        {/* Step 2: Series Detail & Chapter Selection */}
        {step === "detail" && seriesDetail && (
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button onClick={handleBack} className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke daftar
            </button>

            {/* Series Info Card */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
                <h2 className="text-lg font-bold text-white">Detail Series</h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* Series Image */}
                  {seriesDetail.image && (
                    <div className="flex-shrink-0">
                      <img src={seriesDetail.image} alt={seriesDetail.title} className="w-40 h-60 object-cover rounded-lg border border-gray-700" />
                    </div>
                  )}

                  {/* Series Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-white mb-4">{seriesDetail.title}</h2>

                    <div className="flex flex-wrap gap-3 mb-4">
                      {seriesDetail.rating && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-yellow-500/20 border border-yellow-500/30">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-yellow-400 font-bold text-sm">{seriesDetail.rating}</span>
                        </div>
                      )}
                      {seriesDetail.status && (
                        <div className="px-3 py-1.5 rounded bg-green-500/20 border border-green-500/30">
                          <span className="text-green-400 font-medium text-sm">{seriesDetail.status}</span>
                        </div>
                      )}
                    </div>

                    {seriesDetail.genres && seriesDetail.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {seriesDetail.genres.map((genre) => (
                          <span key={genre} className="px-3 py-1 bg-[#2a3142] border border-gray-700 text-gray-300 rounded text-xs font-medium">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {seriesDetail.synopsis && <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">{seriesDetail.synopsis}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Selection */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  📚 Pilih Chapter
                  <span className="text-sm font-normal text-gray-300">({selectedChapters.size} dipilih)</span>
                </h3>

                {/* Select All Button */}
                <button onClick={handleSelectAll} className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium">
                  {selectedChapters.size === seriesDetail.chapters.length ? "✕ Batalkan Semua" : "✓ Pilih Semua"}
                </button>
              </div>

              <div className="p-4">
                {/* Chapters List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {seriesDetail.chapters && seriesDetail.chapters.length > 0 ? (
                    seriesDetail.chapters.map((chapter, index) => {
                      const chapterSlug = chapter.slug.replace(/\/+$/, "").trim();
                      const isSelected = selectedChapters.has(chapterSlug);
                      return (
                        <div
                          key={`${chapter.slug}-${index}`}
                          className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                            isSelected ? "bg-gradient-to-r from-primary/20 to-purple-500/20 border-2 border-primary/50 shadow-lg shadow-primary/10" : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                          }`}>
                          <div className="flex items-center gap-4">
                            {/* Custom Checkbox */}
                            <label className="relative flex items-center cursor-pointer">
                              <input type="checkbox" checked={isSelected} onChange={() => handleChapterToggle(chapter.slug)} className="sr-only peer" />
                              <div
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                  isSelected ? "bg-gradient-to-br from-primary to-purple-500 border-primary scale-110" : "border-slate-600 group-hover:border-slate-500"
                                }`}>
                                {isSelected && (
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </label>

                            {/* Chapter Info */}
                            <div className="flex-1 min-w-0">
                              <div className={`font-semibold transition-colors duration-300 ${isSelected ? "text-white" : "text-slate-200 group-hover:text-white"}`}>{chapter.title}</div>
                              {chapter.time && (
                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {chapter.time}
                                </div>
                              )}
                            </div>

                            {/* Download Single Chapter Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadChapter(chapterSlug);
                              }}
                              disabled={loading}
                              className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 hover:from-primary/30 hover:to-purple-500/30 border border-primary/30 text-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                              title="Download chapter ini">
                              <svg className="w-5 h-5 group-hover/btn:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-400">Tidak ada chapter yang tersedia</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setStep("search");
                  setSeriesDetail(null);
                }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Daftar Series
              </button>
              <button
                onClick={handleDownloadMultiple}
                disabled={selectedChapters.size === 0 || loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download {selectedChapters.size} Chapter{selectedChapters.size > 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar with Animation */}
        {downloadProgress && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-700/50 backdrop-blur-xl p-6 shadow-2xl">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    {downloadProgress.status}
                  </span>
                  <span className="text-primary font-bold text-lg">{Math.round(downloadProgress.current)}%</span>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div
                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{
                      width: `${Math.min(downloadProgress.current, 100)}%`,
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(236, 72, 153), rgb(168, 85, 247));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(219, 39, 119), rgb(147, 51, 234));
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

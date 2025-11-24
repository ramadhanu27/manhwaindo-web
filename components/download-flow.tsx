"use client";

import { useState, useEffect } from "react";
import { generatePDF, generateZIP, downloadBlob } from "@/lib/download-utils";
import { getSeriesList, getSeriesDetail, getChapterImages } from "@/lib/api";

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

  // Download single chapter as PDF
  const handleDownloadChapter = async (chapterSlug: string) => {
    if (!seriesDetail) return;

    setLoading(true);
    setError("");
    setDownloadProgress({ current: 0, total: 100, status: "Starting..." });

    try {
      setDownloadProgress({ current: 5, total: 100, status: "Fetching chapter images..." });

      const data = await getChapterImages(chapterSlug);

      if (data.success && data.data?.images && data.data.images.length > 0) {
        const foundChapter = seriesDetail.chapters.find((ch) => ch.slug.replace(/\/+$/, "").trim() === chapterSlug);

        const chapterData = [
          {
            slug: chapterSlug,
            title: foundChapter?.title || data.data.title || "Chapter",
            images: data.data.images,
          },
        ];

        setDownloadProgress({ current: 50, total: 100, status: "Generating PDF..." });

        const progressCallback = (progress: any) => {
          setDownloadProgress(progress);
        };

        const blob = await generatePDF(seriesDetail.title, chapterData, progressCallback);
        downloadBlob(blob, `${seriesDetail.title} - ${foundChapter?.title || "Chapter"}.pdf`);
        setDownloadProgress(null);
        alert("Download completed!");
      } else {
        throw new Error("No images found for this chapter");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      setDownloadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  // Download multiple chapters as ZIP with PDFs
  const handleDownloadMultiple = async () => {
    if (!seriesDetail || selectedChapters.size === 0) {
      setError("Please select at least one chapter");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadProgress({ current: 0, total: 100, status: "Starting..." });

    try {
      setDownloadProgress({ current: 5, total: 100, status: "Fetching chapter images..." });

      // Fetch chapter images directly from external API
      const chapterData: ChapterImages[] = [];
      const selectedChapterArray = Array.from(selectedChapters);

      for (let i = 0; i < selectedChapterArray.length; i++) {
        const chapterSlug = selectedChapterArray[i];

        try {
          console.log(`\n[${i + 1}/${selectedChapterArray.length}] Fetching chapter: ${chapterSlug}`);

          const data = await getChapterImages(chapterSlug);
          console.log(`  Response success: ${data.success}`);

          if (data.success && data.data?.images && data.data.images.length > 0) {
            // Find chapter title from series detail
            const foundChapter = seriesDetail.chapters.find((ch) => ch.slug.replace(/\/+$/, "").trim() === chapterSlug);

            chapterData.push({
              slug: chapterSlug,
              title: foundChapter?.title || data.data.title || "Chapter",
              images: data.data.images,
            });

            console.log(`✓ Fetched ${chapterSlug}: ${data.data.images.length} images`);
          } else {
            console.warn(`✗ No images in response for ${chapterSlug}`);
          }
        } catch (err) {
          console.error(`✗ Error fetching chapter ${chapterSlug}:`, err);
        }

        // Update progress
        const progress = 5 + ((i + 1) / selectedChapterArray.length) * 40;
        setDownloadProgress({
          current: progress,
          total: 100,
          status: `Fetching chapters... ${i + 1}/${selectedChapterArray.length}`,
        });
      }

      if (chapterData.length === 0) {
        throw new Error("No chapter images found. Please try again.");
      }

      setDownloadProgress({ current: 50, total: 100, status: "Processing..." });

      // Generate files
      const progressCallback = (progress: any) => {
        setDownloadProgress(progress);
      };

      // If only 1 chapter, download as PDF
      if (chapterData.length === 1) {
        const blob = await generatePDF(seriesDetail.title, chapterData, progressCallback);
        downloadBlob(blob, `${seriesDetail.title} - ${chapterData[0].title}.pdf`);
      } else {
        // If 2+ chapters, create ZIP with individual PDFs
        const { jsPDF } = await import("jspdf");
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        for (let i = 0; i < chapterData.length; i++) {
          const chapter = chapterData[i];
          const blob = await generatePDF(seriesDetail.title, [chapter], progressCallback);
          zip.file(`${i + 1}. ${chapter.title}.pdf`, blob);

          setDownloadProgress({
            current: 50 + ((i + 1) / chapterData.length) * 50,
            total: 100,
            status: `Creating ZIP... ${i + 1}/${chapterData.length}`,
          });
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${seriesDetail.title}.zip`);
      }

      setDownloadProgress(null);
      alert("Download completed!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      setDownloadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === "search") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Loading series...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Gradient */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-3">Download Manhwa</h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {step === "search" ? (
              "Pilih series favorit kamu dan download chapter dalam format PDF"
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                {seriesDetail?.title}
              </span>
            )}
          </p>
        </div>

        {/* Error Message with Animation */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-top duration-300">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 border border-red-500/30 p-5 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
              <div className="relative flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-semibold mb-1">Oops! Terjadi kesalahan</h3>
                  <p className="text-red-300/90 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Browse Series */}
        {step === "search" && (
          <>
            {/* Search Input */}
            <div className="mb-8 max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari series manhwa..."
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Cari
                </button>
              </form>
            </div>

            {/* Series Grid with Glassmorphic Cards */}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {searchResults.map((result) => (
                  <button
                    key={result.slug}
                    onClick={() => handleSelectSeries(result.slug)}
                    disabled={loading}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-primary/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    {/* Image Container */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-slate-800/50">
                      <img src={result.image || "/placeholder.jpg"} alt={result.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                      {/* Rating Badge */}
                      {result.rating && (
                        <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400/90 to-orange-500/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <div className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
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

                      {/* Hover Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 text-slate-100 group-hover:text-primary transition-colors duration-300">{result.title}</h3>
                      {result.type && (
                        <p className="text-xs text-slate-400 line-clamp-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {result.type}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Pagination */}
            {searchResults.length > 0 && (
              <div className="mt-12 flex justify-center gap-2 flex-wrap">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={loading}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                      className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      1
                    </button>
                  )}
                  
                  {/* Show current page */}
                  <span className="px-3 py-2 bg-primary border border-primary text-primary-foreground rounded-lg text-sm">
                    {currentPage}
                  </span>
                  
                  {/* Show next few pages */}
                  {currentPage < 5 && [currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4].slice(0, 4 - (currentPage - 1)).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  {/* Show ellipsis and last page */}
                  {currentPage < 50 && (
                    <>
                      <span className="px-2 py-2 text-muted-foreground">...</span>
                      <button
                        onClick={() => setCurrentPage(200)}
                        disabled={loading}
                        className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        200
                      </button>
                    </>
                  )}
                  
                  {/* If we're near the end, show last few pages */}
                  {currentPage >= 50 && currentPage < 195 && (
                    <>
                      <span className="px-2 py-2 text-muted-foreground">...</span>
                      {[currentPage - 1, currentPage + 1, currentPage + 2].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {pageNum}
                        </button>
                      ))}
                      <span className="px-2 py-2 text-muted-foreground">...</span>
                      <button
                        onClick={() => setCurrentPage(200)}
                        disabled={loading}
                        className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        200
                      </button>
                    </>
                  )}
                  
                  {/* If we're at the very end */}
                  {currentPage >= 195 && currentPage < 200 && (
                    <>
                      <span className="px-2 py-2 text-muted-foreground">...</span>
                      {[196, 197, 198, 199].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="px-3 py-2 bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                )}
              </div>
            )}

            {searchResults.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700">
                  <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-slate-400 font-medium">Tidak ada series yang tersedia</p>
              </div>
            )}
          </>
        )}

        {/* Step 2: Series Detail & Chapter Selection */}
        {step === "detail" && seriesDetail && (
          <div className="max-w-5xl mx-auto">
            {/* Series Info Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm p-8 mb-8 shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}></div>
              </div>

              <div className="relative flex flex-col md:flex-row gap-8 mb-8">
                {/* Series Image */}
                {seriesDetail.image && (
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                      <img src={seriesDetail.image} alt={seriesDetail.title} className="relative w-48 h-72 object-cover rounded-2xl shadow-2xl" />
                    </div>
                  </div>
                )}

                {/* Series Details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">{seriesDetail.title}</h2>

                  <div className="flex flex-wrap gap-4 mb-4">
                    {seriesDetail.rating && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-yellow-400 font-bold">{seriesDetail.rating}</span>
                      </div>
                    )}
                    {seriesDetail.status && (
                      <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                        <span className="text-green-400 font-medium">{seriesDetail.status}</span>
                      </div>
                    )}
                  </div>

                  {seriesDetail.genres && seriesDetail.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {seriesDetail.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1.5 bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-primary rounded-full text-sm font-medium hover:from-primary/30 hover:to-purple-500/30 transition-all duration-300">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {seriesDetail.synopsis && <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">{seriesDetail.synopsis}</p>}
                </div>
              </div>

              {/* Chapter Selection Header */}
              <div className="relative border-t border-slate-700/50 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-lg">📚</span>
                    Pilih Chapter
                    <span className="text-lg font-normal text-slate-400">({selectedChapters.size} dipilih)</span>
                  </h3>

                  {/* Select All Button */}
                  <button
                    onClick={handleSelectAll}
                    className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105">
                    {selectedChapters.size === seriesDetail.chapters.length ? "✕ Batalkan Semua" : "✓ Pilih Semua"}
                  </button>
                </div>

                {/* Chapters List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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

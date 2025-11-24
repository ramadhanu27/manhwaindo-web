'use client';

import { useState, useEffect } from 'react';
import { generatePDF, generateZIP, downloadBlob } from '@/lib/download-utils';
import { getSeriesList, getSeriesDetail, getChapterImages } from '@/lib/api';

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

type Step = 'search' | 'detail';

export default function DownloadFlow() {
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [seriesDetail, setSeriesDetail] = useState<SeriesDetail | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
    status: string;
  } | null>(null);

  // Fetch series list on component mount
  useEffect(() => {
    const fetchSeriesList = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getSeriesList(1, {});
        if (data.success) {
          setSearchResults(data.data || []);
        } else {
          throw new Error('Failed to load series list');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load series list. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesList();
  }, []);


  // Step 2: View Series Detail
  const handleSelectSeries = async (seriesSlug: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await getSeriesDetail(seriesSlug);
      if (data.success && data.data) {
        setSeriesDetail(data.data);
        setSelectedChapters(new Set());
        setStep('detail');
      } else {
        throw new Error('Failed to load series detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load series detail. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Toggle Chapter Selection
  const handleChapterToggle = (chapterSlug: string) => {
    const cleanSlug = chapterSlug.replace(/\/+$/, '').trim();
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
      const allChapters = new Set(
        seriesDetail.chapters.map((ch) => ch.slug.replace(/\/+$/, '').trim())
      );
      setSelectedChapters(allChapters);
    }
  };

  // Download single chapter as PDF
  const handleDownloadChapter = async (chapterSlug: string) => {
    if (!seriesDetail) return;

    setLoading(true);
    setError('');
    setDownloadProgress({ current: 0, total: 100, status: 'Starting...' });

    try {
      setDownloadProgress({ current: 5, total: 100, status: 'Fetching chapter images...' });

      const data = await getChapterImages(chapterSlug);
      
      if (data.success && data.data?.images && data.data.images.length > 0) {
        const foundChapter = seriesDetail.chapters.find(
          (ch) => ch.slug.replace(/\/+$/, '').trim() === chapterSlug
        );

        const chapterData = [{
          slug: chapterSlug,
          title: foundChapter?.title || data.data.title || 'Chapter',
          images: data.data.images,
        }];

        setDownloadProgress({ current: 50, total: 100, status: 'Generating PDF...' });

        const progressCallback = (progress: any) => {
          setDownloadProgress(progress);
        };

        const blob = await generatePDF(seriesDetail.title, chapterData, progressCallback);
        downloadBlob(blob, `${seriesDetail.title} - ${foundChapter?.title || 'Chapter'}.pdf`);
        setDownloadProgress(null);
        alert('Download completed!');
      } else {
        throw new Error('No images found for this chapter');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
      setDownloadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  // Download multiple chapters as ZIP with PDFs
  const handleDownloadMultiple = async () => {
    if (!seriesDetail || selectedChapters.size === 0) {
      setError('Please select at least one chapter');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadProgress({ current: 0, total: 100, status: 'Starting...' });

    try {
      setDownloadProgress({ current: 5, total: 100, status: 'Fetching chapter images...' });

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
            const foundChapter = seriesDetail.chapters.find(
              (ch) => ch.slug.replace(/\/+$/, '').trim() === chapterSlug
            );

            chapterData.push({
              slug: chapterSlug,
              title: foundChapter?.title || data.data.title || 'Chapter',
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
        throw new Error('No chapter images found. Please try again.');
      }

      setDownloadProgress({ current: 50, total: 100, status: 'Processing...' });

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
        const { jsPDF } = await import('jspdf');
        const JSZip = (await import('jszip')).default;
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

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, `${seriesDetail.title}.zip`);
      }

      setDownloadProgress(null);
      alert('Download completed!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
      setDownloadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'search') {
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
        <h1 className="text-3xl font-bold mb-2">Download Manhwa</h1>
        <p className="text-muted-foreground">
          {step === 'search' 
            ? 'Select a series to download chapters'
            : `Downloading from: ${seriesDetail?.title}`}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Step 1: Browse Series */}
      {step === 'search' && (
        <>
          {/* Series Grid */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
              {searchResults.map((result) => (
                <button
                  key={result.slug}
                  onClick={() => handleSelectSeries(result.slug)}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Image */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                    <img
                      src={result.image || '/placeholder.jpg'}
                      alt={result.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Rating - Bottom Left */}
                    {result.rating && (
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold">{result.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <h3 className="font-semibold text-xs line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {result.title}
                    </h3>
                    {result.type && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {result.type}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchResults.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No series available</p>
            </div>
          )}
        </>
      )}

      {/* Step 2: Series Detail & Chapter Selection */}
      {step === 'detail' && seriesDetail && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
            <div className="flex gap-6 mb-6">
              {seriesDetail.image && (
                <img
                  src={seriesDetail.image}
                  alt={seriesDetail.title}
                  className="w-32 h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{seriesDetail.title}</h2>
                {seriesDetail.rating && (
                  <p className="text-yellow-400 mb-2">⭐ Rating: {seriesDetail.rating}</p>
                )}
                {seriesDetail.status && (
                  <p className="text-slate-400 mb-2">Status: {seriesDetail.status}</p>
                )}
                {seriesDetail.genres && seriesDetail.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {seriesDetail.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                {seriesDetail.synopsis && (
                  <p className="text-slate-300 text-sm line-clamp-3">{seriesDetail.synopsis}</p>
                )}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              Step 2: Select Chapters ({selectedChapters.size} selected)
            </h3>

            {/* Select All Button */}
            <button
              onClick={handleSelectAll}
              className="mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
            >
              {selectedChapters.size === seriesDetail.chapters.length
                ? 'Deselect All'
                : 'Select All'}
            </button>

            {/* Chapters List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {seriesDetail.chapters && seriesDetail.chapters.length > 0 ? (
                seriesDetail.chapters.map((chapter, index) => {
                  const chapterSlug = chapter.slug.replace(/\/+$/, '').trim();
                  const isSelected = selectedChapters.has(chapterSlug);
                  return (
                    <div
                      key={`${chapter.slug}-${index}`}
                      className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleChapterToggle(chapter.slug)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium">{chapter.title}</div>
                        {chapter.time && (
                          <div className="text-xs text-slate-400">{chapter.time}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownloadChapter(chapterSlug)}
                        disabled={loading}
                        className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download this chapter"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400">No chapters available</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep('search');
                setSeriesDetail(null);
              }}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Search
            </button>
            <button
              onClick={handleDownloadMultiple}
              disabled={selectedChapters.size === 0 || loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download {selectedChapters.size} Chapter{selectedChapters.size > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {downloadProgress && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">{downloadProgress.status}</span>
              <span className="text-slate-400 text-sm">
                {Math.round(downloadProgress.current)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(downloadProgress.current, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function ReaderClient({ images, manhwaSlug, manhwaTitle, chapterTitle, prevSlug, nextSlug }) {
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Reader Settings States
  const [showSettings, setShowSettings] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100); // 50% to 160%
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(2); // 1 to 10

  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const settingsRef = useRef(null);

  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close settings panel on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    }
    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  // Smooth Auto Scroll Implementation via requestAnimationFrame (time-delta based)
  useEffect(() => {
    if (!autoScrollActive) {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();

    const scroll = (time) => {
      const delta = (time - lastTime) / 16.666; // Normalize to 60fps frames
      lastTime = time;

      // Scroll speed in pixels per 60fps frame:
      // speed 1: 1.5px, speed 2: 3px, speed 5: 7.5px, speed 10: 15px
      const pixelsToScroll = autoScrollSpeed * 1.5 * delta;

      window.scrollBy(0, pixelsToScroll);
      autoScrollRef.current = requestAnimationFrame(scroll);
    };

    autoScrollRef.current = requestAnimationFrame(scroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [autoScrollActive, autoScrollSpeed]);

  // Spacebar to toggle autoscroll & keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && prevSlug) {
        window.location.href = `/komik/${manhwaSlug}/${prevSlug}`;
      }
      if (e.key === "ArrowRight" && nextSlug) {
        window.location.href = `/komik/${manhwaSlug}/${nextSlug}`;
      }
      if (e.key === " " || e.code === "Space") {
        if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
          e.preventDefault();
          setAutoScrollActive((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [manhwaSlug, prevSlug, nextSlug]);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleImageError = useCallback((index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter out non-chapter images (thumbnails from other manga)
  const chapterImages = images.filter((url) => {
    // Keep images that are from the chapter path or are banner/logo images
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes(manhwaSlug.toLowerCase()) || lowerUrl.includes("logo") || lowerUrl.includes("banner");
  });

  // Fallback to all images if filtering removes everything
  const displayImages = chapterImages.length > 0 ? chapterImages : images;

  return (
    <>
      {/* Image container */}
      <div 
        ref={containerRef} 
        className="mx-auto bg-dark-900 min-h-screen transition-all duration-200"
        style={{ maxWidth: `${(zoomLevel / 100) * 768}px`, width: '100%' }}
      >
        {displayImages.map((url, i) => (
          <div key={i} className="relative w-full">
            {/* Loading placeholder */}
            {!loadedImages[i] && !failedImages[i] && (
              <div className="w-full h-[300px] flex items-center justify-center bg-dark-800/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
                  <span className="text-xs text-dark-500">Memuat gambar {i + 1}...</span>
                </div>
              </div>
            )}

            {/* Error placeholder */}
            {failedImages[i] && (
              <div className="w-full h-[200px] flex items-center justify-center bg-dark-800/30 border border-dark-700/30">
                <div className="flex flex-col items-center gap-2 text-dark-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs">Gagal memuat gambar</span>
                  <button
                    onClick={() => {
                      setFailedImages((prev) => {
                        const copy = { ...prev };
                        delete copy[i];
                        return copy;
                      });
                      setLoadedImages((prev) => {
                        const copy = { ...prev };
                        delete copy[i];
                        return copy;
                      });
                    }}
                    className="text-xs text-accent-400 hover:underline">
                    Coba lagi
                  </button>
                </div>
              </div>
            )}

            {/* Actual image */}
            {!failedImages[i] && (
              <img
                src={url}
                alt={`${chapterTitle} - Page ${i + 1}`}
                className={`w-full h-auto block select-none transition-opacity duration-300 ${loadedImages[i] ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                loading={i < 3 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(i)}
                onError={() => handleImageError(i)}
                draggable={false}
              />
            )}
          </div>
        ))}

        {/* End indicator */}
        <div className="py-12 text-center border-t border-dark-700/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-dark-300">— Akhir dari {chapterTitle} —</p>
            <p className="text-xs text-dark-500">{manhwaTitle}</p>
          </div>
        </div>
      </div>

      {/* Floating settings panel trigger button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`fixed bottom-20 right-4 sm:right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${showSettings ? "bg-accent-600 text-white scale-110 border border-accent-500/50" : "glass text-dark-300 border border-dark-700/50 hover:text-accent-400 hover:border-accent-500/30 hover:scale-110"}`}
        aria-label="Pengaturan Pembaca"
        title="Pengaturan Pembaca"
      >
        <svg className={`w-5 h-5 ${autoScrollActive ? "animate-spin" : ""}`} style={{ animationDuration: '4s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Floating Settings Card */}
      {showSettings && (
        <div
          ref={settingsRef}
          className="fixed bottom-36 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-80 bg-dark-900/95 border border-dark-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md slide-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-dark-800/85 mb-4">
            <h4 className="text-sm font-bold text-dark-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Pengaturan Reader
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              className="w-6 h-6 rounded-lg bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-dark-400 hover:text-dark-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Auto Scroll Option */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-dark-300">Auto Scroll</span>
                <button
                  onClick={() => setAutoScrollActive(!autoScrollActive)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${autoScrollActive ? "bg-accent-600 text-white" : "bg-dark-800 text-dark-400 hover:text-dark-200"}`}
                >
                  {autoScrollActive ? "Aktif (Space)" : "Nonaktif"}
                </button>
              </div>

              {autoScrollActive && (
                <div className="space-y-1 bg-dark-950/50 p-2.5 rounded-xl border border-dark-800/40">
                  <div className="flex items-center justify-between text-[10px] text-dark-400 font-medium">
                    <span>Kecepatan</span>
                    <span className="text-accent-400 font-bold">{autoScrollSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={autoScrollSpeed}
                    onChange={(e) => setAutoScrollSpeed(parseInt(e.target.value))}
                    className="w-full h-1 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                  />
                </div>
              )}
            </div>

            {/* Zoom / Size Option */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-dark-300">Lebar Halaman / Zoom</span>
                <span className="text-[10px] text-accent-400 font-bold">{zoomLevel}%</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
                  className="flex-1 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs text-dark-200 hover:text-white font-bold transition-colors"
                  title="Zoom Out"
                >
                  －
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-[10px] text-dark-400 hover:text-dark-200 font-semibold transition-colors"
                  title="Reset 100%"
                >
                  Reset
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(160, prev + 10))}
                  className="flex-1 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs text-dark-200 hover:text-white font-bold transition-colors"
                  title="Zoom In"
                >
                  ＋
                </button>
              </div>

              <input
                type="range"
                min="50"
                max="160"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                className="w-full h-1 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
              />
            </div>

            {/* Quick tips */}
            <div className="text-[9px] text-dark-500 leading-relaxed text-center pt-2 border-t border-dark-800/80">
              <span className="font-semibold text-dark-400">Tips:</span> Tekan tombol <span className="px-1 py-0.5 rounded bg-dark-800 text-dark-300 border border-dark-700">Spacebar</span> untuk menjeda/menjalankan Auto Scroll.
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-12 h-12 rounded-full bg-accent-600 text-white flex items-center justify-center shadow-xl hover:bg-accent-500 hover:scale-110 transition-all"
          aria-label="Scroll to top">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Progress indicator */}
      <ProgressBar totalImages={displayImages.length} />
    </>
  );
}

/* ── Reading progress bar ── */
function ProgressBar({ totalImages }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-dark-800/50">
      <div className="h-full bg-accent-500 transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}

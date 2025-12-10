"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { extractSeriesSlug, encodeSlug } from "@/lib/slug-utils";

interface Series {
  title: string;
  slug: string;
  image: string;
  type?: string;
  rating?: string;
  synopsis?: string;
  genres?: string[];
  status?: string;
  author?: string;
  chapters?: Array<{ title: string }>;
}

interface HeroCarouselProps {
  series: Series[];
}

export default function HeroCarousel({ series }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || series.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % series.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [series.length, mounted]);

  if (!series || series.length === 0) {
    return null;
  }

  // Prevent hydration mismatch - don't render until mounted on client
  if (!mounted) {
    return (
      <div className="relative w-full h-[350px] md:h-[400px] rounded-xl overflow-hidden bg-[#1a1f2e] border border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2e] via-[#1a1f2e]/95 to-[#1a1f2e]/50" />
      </div>
    );
  }

  const currentSeries = series[currentIndex];

  return (
    <div className="relative w-full h-[350px] md:h-[400px] rounded-xl overflow-hidden bg-[#1a1f2e] border border-gray-800">
      {/* Background Image - Blurred */}
      <div className="absolute inset-0">
        <Image src={currentSeries.image || "/placeholder.jpg"} alt={currentSeries.title} fill className="object-cover blur-sm opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f2e] via-[#1a1f2e]/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="w-full px-6 md:px-8">
          <div className="flex gap-6 md:gap-8 items-center">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              {/* Rating Badge */}
              {currentSeries.rating && (
                <div className="inline-flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 mb-4">
                  <span className="text-yellow-400 font-bold text-lg">{currentSeries.rating}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold mb-3 line-clamp-2 text-white">{currentSeries.title}</h1>

              {/* Type Badge */}
              {currentSeries.type && <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold uppercase mb-4">{currentSeries.type}</span>}

              {/* Genres */}
              {currentSeries.genres && currentSeries.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentSeries.genres.slice(0, 5).map((genre, idx) => (
                    <Link key={idx} href={`/search?genre=${genre.toLowerCase().replace(" ", "-")}`} className="text-green-400 hover:text-green-300 text-sm transition-colors">
                      {genre}
                      {idx < Math.min(currentSeries.genres!.length, 5) - 1 && ","}
                    </Link>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {currentSeries.synopsis && (
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-1">SINOPSIS</h4>
                  <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">{currentSeries.synopsis}</p>
                </div>
              )}

              {/* Status & Author */}
              <div className="space-y-1 text-sm">
                {currentSeries.status && (
                  <p className="text-gray-400">
                    Status: <span className="text-green-400">{currentSeries.status}</span>
                  </p>
                )}
                {currentSeries.author && (
                  <p className="text-gray-400">
                    Author: <span className="text-white">{currentSeries.author}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Cover Image */}
            <div className="hidden md:block flex-shrink-0">
              <Link href={`/series/${encodeSlug(extractSeriesSlug(currentSeries.slug))}`}>
                <div className="relative w-40 h-56 rounded-lg overflow-hidden shadow-2xl shadow-black/50 hover:scale-105 transition-transform duration-300 border-2 border-gray-700">
                  <Image src={currentSeries.image || "/placeholder.jpg"} alt={currentSeries.title} fill className="object-cover" priority />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {mounted && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {series.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-green-500 w-8" : "bg-gray-600 w-2 hover:bg-gray-500"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {mounted && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + series.length) % series.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-green-500/80 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % series.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-green-500/80 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

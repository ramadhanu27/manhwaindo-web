"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const autoPlayRef = useRef(null);

  if (!slides || slides.length === 0) return null;

  // Calculate which card is closest to the horizontal center of the carousel container
  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      const cards = container.children;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
      setActiveIndex(closestIndex);
    }
  };

  const goToIndex = (index) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const card = container.children[index];
      if (card) {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const targetScrollLeft = cardCenter - container.clientWidth / 2;
        container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
        setActiveIndex(index);
      }
    }
  };

  const nextSlide = () => {
    stopAutoPlay();
    let nextIndex = activeIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    goToIndex(nextIndex);
  };

  const prevSlide = () => {
    stopAutoPlay();
    let prevIndex = activeIndex - 1;
    if (prevIndex < 0) {
      prevIndex = slides.length - 1;
    }
    goToIndex(prevIndex);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (slides.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      goToIndex(nextIndex);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  // Recalculate on mount to find initial center card
  useEffect(() => {
    if (containerRef.current && slides.length > 0) {
      const timer = setTimeout(() => {
        handleScroll();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [slides]);

  // Restart autoplay when activeIndex or slides change
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeIndex, slides]);

  return (
    <section className="relative w-full bg-dark-950 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-lg bg-dark-900/90 border border-dark-700/80 hidden md:flex items-center justify-center text-dark-200 hover:text-white hover:border-accent-500/50 hover:bg-accent-600/10 transition-all shadow-xl md:opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-lg bg-dark-900/90 border border-dark-700/80 hidden md:flex items-center justify-center text-dark-200 hover:text-white hover:border-accent-500/50 hover:bg-accent-600/10 transition-all shadow-xl md:opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Horizontal Carousel Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          onTouchStart={stopAutoPlay}
          onTouchEnd={startAutoPlay}
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
          className="relative flex gap-6 overflow-x-auto scroll-smooth scroll-hidden py-8 px-4"
        >
          {slides.map((slide, i) => {
            // Dynamic text mappings to match look and feel cleanly
            const isBlackAndWhite = slide.type === "Manga";
            const colorFormat = isBlackAndWhite ? "Hitam Putih" : "Warna";
            const genre = slide.genre || slide.genres?.[0] || "Aksi";
            const synopsis = slide.synopsis || slide.excerpt || slide.description || 
              "Ronan menjalani kehidupan yang sia-sia penuh dengan penyesalan. Kesempatan kedua menimpanya di akhir hidupnya...";

            const isActive = activeIndex === i;

            return (
              <div
                key={slide.id}
                className={`relative w-[185px] sm:w-[230px] h-[270px] sm:h-[320px] flex-shrink-0 transition-all duration-300 ${isActive ? "scale-[1.05] sm:scale-[1.07] z-20 shadow-2xl shadow-accent-600/20" : "scale-[0.94] opacity-50 z-10"} group/card`}
              >
                {/* Red Offset Outline Backdrop (Solid red border behind the card) */}
                <div className={`absolute inset-0 border rounded-xl transition-all duration-300 ${isActive ? "border-accent-500 translate-x-[9px] translate-y-[9px] shadow-lg shadow-accent-600/30" : "border-accent-600/40 translate-x-[5px] translate-y-[5px]"}`} />

                {/* Main Card Element */}
                <Link
                  href={`/komik/${slide.slug}`}
                  className={`relative w-full h-full rounded-xl overflow-hidden border bg-dark-800 flex flex-col justify-between p-3.5 sm:p-4 z-10 block transition-all duration-300 ${isActive ? "border-accent-500/60" : "border-dark-700/80"}`}
                >
                  {/* Backdrop Cover Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={slide.cover}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      sizes="(max-width: 640px) 185px, 230px"
                      priority
                    />
                    {/* Linear dark overlay for readability */}
                    <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? "bg-gradient-to-t from-dark-950 via-dark-950/70 to-dark-950/35" : "bg-gradient-to-t from-dark-950/95 via-dark-950/85 to-dark-950/65"}`} />
                  </div>

                  {/* Top content: Type & Title */}
                  <div className="relative z-10">
                    <span className="text-[10px] sm:text-xs font-semibold text-dark-300 block mb-1">
                      {slide.type}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug line-clamp-2 group-hover/card:text-accent-400 transition-colors">
                      {slide.title}
                    </h3>
                  </div>

                  {/* Bottom content: Genre & Synopsis */}
                  <div className="relative z-10 space-y-1.5 mt-auto">
                    <span className="text-[10px] sm:text-xs font-bold text-accent-400 block">
                      {genre}
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-dark-200 line-clamp-3 leading-relaxed">
                      {synopsis}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

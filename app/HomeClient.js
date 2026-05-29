"use client";

import { useState, useEffect } from "react";
import HeroSlider from "./components/HeroSlider";
import UpdateCard from "./components/UpdateCard";
import HotUpdateCard from "./components/HotUpdateCard";
import SidebarPopularCard from "./components/SidebarPopularCard";
import SectionHeader from "./components/SectionHeader";
import AdBanner from "./components/AdBanner";

import { getProxyUrl } from "@/app/lib/api";

export default function HomeClient({ initialData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialData) return;
    async function fetchHome() {
      try {
        const res = await fetch(getProxyUrl("home"));
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching home:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, [initialData]);

  if (loading) {
    return (
      <div>
        {/* Hero skeleton */}
        <div className="w-full h-[500px] sm:h-[550px] lg:h-[600px] skeleton" />

        {/* Layout skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar skeleton */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 order-last lg:order-first">
            <div className="solid-card rounded-xl p-4 bg-dark-900 border border-dark-700/60">
              <div className="h-6 w-36 skeleton mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-16 skeleton rounded flex-shrink-0" />
                    <div className="flex-grow space-y-2">
                      <div className="h-3.5 skeleton rounded w-3/4" />
                      <div className="h-2.5 skeleton rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content skeleton */}
          <main className="flex-1 min-w-0 space-y-10 sm:space-y-14 order-first lg:order-last">
            {/* Hot updates skeleton */}
            <div>
              <div className="h-8 w-48 skeleton rounded-lg mb-2" />
              <div className="h-4 w-64 skeleton rounded-lg mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="solid-card rounded-xl p-3.5 flex flex-col justify-between h-[142px]">
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-full skeleton flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 skeleton rounded w-3/4" />
                        <div className="h-3 skeleton rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-4 skeleton rounded w-full mt-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="section-divider" />

            {/* Latest updates skeleton */}
            <div>
              <div className="h-8 w-48 skeleton rounded-lg mb-2" />
              <div className="h-4 w-64 skeleton rounded-lg mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="solid-card rounded-lg overflow-hidden p-2 flex flex-col gap-2">
                    <div className="aspect-[3/4] skeleton w-full" />
                    <div className="h-4 skeleton rounded w-3/4 mb-1" />
                    <div className="space-y-1.5 mt-auto">
                      <div className="h-6 skeleton rounded w-full" />
                      <div className="h-6 skeleton rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-dark-200 mb-2">Gagal Memuat Data</h2>
          <p className="text-sm text-dark-400 mb-4">Silakan muat ulang halaman atau coba lagi nanti.</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-500 transition-colors">
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ═══ Hero Slider ═══ */}
      <HeroSlider slides={data.slider} />

      {/* ═══ Main Page Layout: Left Sidebar + Right Content ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* ═══ Left Sidebar: Paling Populer (Vertical List) ═══ */}
        <aside className="w-full lg:w-[280px] flex-shrink-0 order-last lg:order-first">
          <div className="solid-card rounded-xl p-4 bg-dark-900 border border-dark-700/60 lg:sticky lg:top-20">
            <h3 className="text-base font-bold text-dark-100 mb-4 pb-2 border-b border-dark-700/60 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Paling Populer
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {data.most_viewed.map((comic, i) => (
                <SidebarPopularCard key={comic.id} comic={comic} rank={i + 1} />
              ))}
            </div>
          </div>
        </aside>

        {/* ═══ Right Content Area ═══ */}
        <main className="flex-1 min-w-0 space-y-10 sm:space-y-14 order-first lg:order-last">
          
          {/* ═══ Hot Updates ═══ */}
          <section id="hot-updates" className="scroll-mt-20">
            <SectionHeader title="🔥 Hot Updates" subtitle="Update terpopuler minggu ini" icon="fire" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {data.hot_updates.map((comic) => (
                <HotUpdateCard key={comic.id} comic={comic} />
              ))}
            </div>
          </section>

          {/* ═══ Ad: Content ═══ */}
          <AdBanner position="content" />

          <div className="section-divider" />

          {/* ═══ Latest Updates ═══ */}
          <section id="latest-updates" className="scroll-mt-20">
            <SectionHeader title="Update Terbaru" subtitle="Komik yang baru saja diperbarui" icon="clock" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {data.latest_updates.map((comic) => (
                <UpdateCard key={comic.id} comic={comic} />
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* ═══ Ad: Footer ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner position="footer" />
      </div>
    </div>
  );
}

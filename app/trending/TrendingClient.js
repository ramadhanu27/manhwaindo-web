"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TypeBadge from "@/app/components/TypeBadge";

const PERIODS = [
  { value: "weekly", label: "Mingguan", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { value: "monthly", label: "Bulanan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  {
    value: "all",
    label: "Semua",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const RANK_STYLES = {
  1: "from-yellow-400 to-amber-500 text-dark-950 shadow-yellow-500/30",
  2: "from-slate-300 to-slate-400 text-dark-950 shadow-slate-400/30",
  3: "from-amber-600 to-amber-700 text-white shadow-amber-600/30",
};

import { getProxyUrl } from "@/app/lib/api";

export default function TrendingClient() {
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrending() {
      setLoading(true);
      try {
        const res = await fetch(getProxyUrl("trending", { period }), { signal: controller.signal });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
    return () => controller.abort();
  }, [period]);

  return (
    <div className="min-h-screen">
      {/* ═══ Header ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-accent-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-100">Trending</h1>
            <p className="text-sm text-dark-400">Komik paling populer saat ini</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* ═══ Period Tabs ═══ */}
        <div className="flex items-center gap-2 mb-8">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                period === p.value ? "bg-accent-600 text-white shadow-lg" : "bg-dark-800 border border-dark-700 text-dark-300 hover:text-dark-100 hover:border-dark-500"
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.icon} />
              </svg>
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>

        {/* ═══ Trending Grid ═══ */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="solid-card rounded-xl p-4 flex gap-4">
                <div className="w-10 h-10 skeleton rounded-xl flex-shrink-0" />
                <div className="w-20 h-28 sm:w-24 sm:h-32 skeleton rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-5 skeleton rounded w-2/3" />
                  <div className="h-4 skeleton rounded w-1/3" />
                  <div className="h-3 skeleton rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-dark-400 font-medium">Belum ada data trending.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((comic) => (
              <TrendingCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Trending Card ── */
function TrendingCard({ comic }) {
  const isTop3 = comic.rank <= 3;
  const rankStyle = RANK_STYLES[comic.rank] || "";

  return (
    <Link href={`/komik/${comic.slug}`} className="solid-card rounded-xl p-4 flex items-center gap-4 group card-hover transition-all duration-300">
      {/* Rank */}
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-extrabold flex-shrink-0 transition-transform group-hover:scale-110 ${
          isTop3 ? `${rankStyle} text-lg sm:text-xl shadow-lg` : "bg-dark-800 border border-dark-700 text-dark-400 text-base sm:text-lg"
        }`}>
        {comic.rank}
      </div>

      {/* Cover */}
      <div className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
        <Image src={comic.cover} alt={comic.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="80px" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="text-sm sm:text-base font-bold text-dark-100 group-hover:text-accent-400 transition-colors truncate sm:whitespace-normal sm:line-clamp-2">{comic.title}</h3>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TypeBadge type={comic.type} size="xs" />
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${comic.status === "completed" ? "badge-completed" : "badge-ongoing"}`}>{comic.status}</span>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 star-filled" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-rating-gold">{comic.rating}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1 text-dark-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs font-medium">{comic.views.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 hidden sm:block">
        <svg className="w-5 h-5 text-dark-600 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

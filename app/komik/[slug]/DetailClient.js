"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ChapterList from "./ChapterList";
import TypeBadge from "@/app/components/TypeBadge";

import { getProxyUrl } from "@/app/lib/api";

export default function DetailClient({ initialData, slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    async function fetchDetail() {
      try {
        const res = await fetch(getProxyUrl(`manhwa/${slug}`));
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Error fetching manhwa detail:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchDetail();
  }, [slug, initialData]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero skeleton */}
        <div className="w-full h-[320px] sm:h-[380px] lg:h-[420px] skeleton" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-56 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            <div className="mx-auto md:mx-0">
              <div className="w-[180px] h-[260px] sm:w-[200px] sm:h-[290px] lg:w-[220px] lg:h-[320px] skeleton rounded-2xl" />
            </div>
            <div className="flex-1 pt-8 space-y-4">
              <div className="h-6 w-24 skeleton rounded-full" />
              <div className="h-10 w-3/4 skeleton rounded-lg" />
              <div className="flex gap-3">
                <div className="h-5 w-20 skeleton rounded" />
                <div className="h-5 w-24 skeleton rounded" />
                <div className="h-5 w-28 skeleton rounded" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-7 w-16 skeleton rounded-lg" />
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-12 w-48 skeleton rounded-xl" />
                <div className="h-12 w-40 skeleton rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center">
            <svg className="w-10 h-10 text-neon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark-200 mb-2">Komik Tidak Ditemukan</h2>
          <p className="text-sm text-dark-400 mb-6">Komik yang kamu cari tidak ada atau sudah dihapus.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  // Strip HTML tags
  const cleanDescription = data.description
    ? data.description
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim()
    : "";

  const firstChapter = data.chapters?.length > 0 ? data.chapters[data.chapters.length - 1] : null;
  const lastChapter = data.chapters?.length > 0 ? data.chapters[0] : null;

  // Format views to Indonesian 'rb' format
  const formattedViews = (() => {
    if (!data.views) return "0";
    if (data.views >= 1000) {
      return `${Math.round(data.views / 1000)} rb`;
    }
    return data.views.toLocaleString();
  })();

  return (
    <div className="min-h-screen">
      {/* ═══ Hero Banner ═══ */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[400px] overflow-hidden">
        <Image src={data.cover} alt={data.title} fill className="object-cover blur-md scale-105 opacity-40" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/20 via-dark-950/80 to-dark-950" />
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Cover with offset red border */}
          <div className="flex-shrink-0 mx-auto md:mx-0 relative w-[180px] h-[260px] sm:w-[200px] sm:h-[290px] lg:w-[220px] lg:h-[320px] group">
            {/* Red Offset Border Backdrop */}
            <div className="absolute inset-0 border border-accent-600 rounded-xl translate-x-[7px] translate-y-[7px]" />
            {/* Main Cover Container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-dark-600 z-10">
              <Image src={data.cover} alt={data.title} fill className="object-cover" priority sizes="220px" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center md:text-left pt-0 md:pt-8">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <TypeBadge type={data.type} size="md" />
              {data.release_year && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-dark-800 text-dark-300 border border-dark-700">{data.release_year}</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight tracking-tight">{data.title}</h1>
            {data.alt_title && <p className="text-sm text-dark-400 mb-4 italic font-medium">{data.alt_title}</p>}

            {/* Rating & Views */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.round(data.rating / 2) ? "star-filled" : "text-dark-600"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-rating-gold">{data.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 text-dark-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium">{formattedViews} views</span>
              </div>
              <div className="flex items-center gap-1.5 text-dark-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm font-medium">{data.total_chapters} Chapter</span>
              </div>
            </div>

            {/* Genres */}
            {data.genres?.length > 0 && (
              <div className="flex items-center justify-center md:justify-start flex-wrap gap-2 mb-6">
                {data.genres.map((genre) => (
                  <Link
                    key={genre.slug}
                    href={`/manhwa/genre/${genre.slug}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-800 text-dark-300 border border-dark-700 hover:border-accent-500/30 hover:text-accent-400 transition-colors">
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              {firstChapter && (
                <Link href={`/komik/${data.slug}/${firstChapter.slug}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-600 text-white font-bold text-sm hover:bg-accent-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Baca Chapter Pertama
                </Link>
              )}
              {lastChapter && lastChapter !== firstChapter && (
                <Link
                  href={`/komik/${data.slug}/${lastChapter.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-dark-800 border border-dark-600 text-dark-200 font-bold text-sm hover:text-dark-100 hover:border-dark-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Chapter Terbaru
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Details grid ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Synopsis */}
            <div className="solid-card rounded-xl p-6">
              <h2 className="text-lg font-extrabold text-dark-100 mb-4 pl-3 border-l-4 border-accent-600 flex items-center gap-2">
                Sinopsis
              </h2>
              <p className="text-sm text-dark-300 leading-relaxed whitespace-pre-line font-medium">{cleanDescription || "Belum ada sinopsis."}</p>
            </div>

            {/* Chapter list */}
            <div className="solid-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-dark-100 pl-3 border-l-4 border-accent-600 flex items-center gap-2">
                  Daftar Chapter
                </h2>
                <span className="text-xs text-dark-400 font-bold">{data.total_chapters} Chapter</span>
              </div>
              <ChapterList chapters={data.chapters} slug={data.slug} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="solid-card rounded-xl p-6">
              <h3 className="text-base font-extrabold text-dark-100 mb-4 pl-3 border-l-4 border-accent-600 flex items-center gap-2">
                Informasi
              </h3>
              <div className="space-y-3">
                <InfoRow label="Status" value={<span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${data.status === "completed" ? "badge-completed" : "badge-ongoing"}`}>{data.status}</span>} />
                <InfoRow label="Tipe" value={<TypeBadge type={data.type} size="sm" />} />
                <InfoRow label="Author" value={data.author || "-"} />
                <InfoRow label="Artist" value={data.artist || "-"} />
                {data.release_year && <InfoRow label="Tahun Rilis" value={data.release_year} />}
                <InfoRow label="Total Chapter" value={data.total_chapters} />
                <InfoRow
                  label="Rating"
                  value={
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 star-filled" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-rating-gold">{data.rating}</span>
                    </span>
                  }
                />
                <InfoRow label="Dilihat" value={`${formattedViews} kali`} />
                {data.updated_at && <InfoRow label="Terakhir Update" value={data.updated_at} />}
              </div>
            </div>

            {data.genres?.length > 0 && (
              <div className="solid-card rounded-xl p-6">
                <h3 className="text-base font-extrabold text-dark-100 mb-4 pl-3 border-l-4 border-accent-600 flex items-center gap-2">
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      href={`/manhwa/genre/${genre.slug}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-800 text-dark-300 border border-dark-700 hover:border-accent-500/30 hover:text-accent-400 transition-colors">
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0">
      <span className="text-xs text-dark-400 font-medium">{label}</span>
      <span className="text-sm text-dark-200 font-medium">{value}</span>
    </div>
  );
}

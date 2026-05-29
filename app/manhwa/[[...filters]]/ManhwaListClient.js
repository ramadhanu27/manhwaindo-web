"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TypeBadge from "@/app/components/TypeBadge";

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Semua Tipe" },
  { value: "manhwa", label: "Manhwa" },
  { value: "manga", label: "Manga" },
  { value: "manhua", label: "Manhua" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru" },
  { value: "views", label: "Populer" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Judul A-Z" },
];

import { getProxyUrl } from "@/app/lib/api";

export default function ManhwaListClient({ initialGenre = "", initialStatus = "", initialType = "", initialOrderby = "latest", initialSearch = "", initialPage = 1 }) {
  const router = useRouter();

  const [search, setSearch] = useState(initialSearch);
  const [genre, setGenre] = useState(initialGenre);
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState(initialType);
  const [orderby, setOrderby] = useState(initialOrderby);
  const [page, setPage] = useState(initialPage);
  const [perPage] = useState(20);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [showGenrePanel, setShowGenrePanel] = useState(false);
  const [genres, setGenres] = useState([]);

  // Fetch genres on mount
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(getProxyUrl("genres"));
        const json = await res.json();
        if (json.success) setGenres(json.data);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    }
    fetchGenres();
  }, []);

  // Build path-based browser URL
  // e.g. /manhwa/genre/action/status/ongoing/type/manga/order/popular
  const buildPathUrl = useCallback(() => {
    const segments = [];
    if (genre) segments.push("genre", genre);
    if (status) segments.push("status", status);
    if (type) segments.push("type", type);
    if (orderby && orderby !== "latest") segments.push("order", orderby);
    if (search.trim()) segments.push("search", encodeURIComponent(search.trim()));
    if (page > 1) segments.push("page", String(page));
    if (segments.length === 0) return "/manhwa";
    return `/manhwa/${segments.join("/")}`;
  }, [genre, status, type, orderby, search, page]);

  // Build API query params
  const buildApiParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    if (search.trim()) params.set("search", search.trim());
    if (genre) params.set("genre", genre);
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (orderby && orderby !== "latest") params.set("orderby", orderby);
    return params;
  }, [page, perPage, search, genre, status, type, orderby]);

  // Fetch data
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      try {
        const params = buildApiParams();
        const paramsObj = Object.fromEntries(params.entries());
        const res = await fetch(getProxyUrl("manhwa", paramsObj), { signal: controller.signal });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          setMeta(json.meta);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Update browser URL (clean path)
    router.replace(buildPathUrl(), { scroll: false });

    return () => controller.abort();
  }, [page, search, genre, status, type, orderby, perPage, buildApiParams, buildPathUrl, router]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const handleGenreToggle = (slug) => {
    const current = genre ? genre.split(",") : [];
    const idx = current.indexOf(slug);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(slug);
    }
    setGenre(current.join(","));
    setPage(1);
  };

  const isGenreActive = (slug) => {
    return genre.split(",").includes(slug);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setGenre("");
    setStatus("");
    setType("");
    setOrderby("latest");
    setPage(1);
  };

  const hasFilters = search || genre || status || type || orderby !== "latest";

  // Pagination range
  const getPageRange = () => {
    const totalPages = meta.pages;
    const current = page;
    const range = [];
    const delta = 2;
    for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
      range.push(i);
    }
    if (range[0] > 1) {
      if (range[0] > 2) range.unshift("...");
      range.unshift(1);
    }
    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) range.push("...");
      range.push(totalPages);
    }
    return range;
  };

  // Dynamic page title
  const pageTitle = (() => {
    const parts = [];
    if (search) parts.push(`"${search}"`);
    if (genre) {
      const genreNames = genre.split(",").map((g) => {
        const found = genres.find((gn) => gn.slug === g);
        return found ? found.name : g.charAt(0).toUpperCase() + g.slice(1);
      });
      parts.push(genreNames.join(", "));
    }
    if (type) parts.push(TYPE_OPTIONS.find((t) => t.value === type)?.label || type);
    if (status) parts.push(STATUS_OPTIONS.find((s) => s.value === status)?.label || status);
    if (orderby === "rating") parts.push("Rating Tertinggi");
    else if (orderby === "views") parts.push("Terpopuler");
    else if (orderby === "title") parts.push("A-Z");
    if (parts.length === 0) return "Jelajahi Komik";
    return `Komik ${parts.join(" ")}`;
  })();

  const pageDescription = (() => {
    if (search) return `Hasil pencarian "${search}" di GaleriKomik.`;
    const parts = [];
    if (genre) parts.push(`genre ${genre.split(",").join(", ")}`);
    if (type) parts.push(`tipe ${type}`);
    if (status) parts.push(`status ${status}`);
    if (parts.length > 0) return `Daftar komik ${parts.join(", ")} di GaleriKomik. Baca online gratis bahasa Indonesia.`;
    return "Jelajahi koleksi lengkap manhwa, manga, dan manhua di GaleriKomik.";
  })();

  // Update document title dynamically
  useEffect(() => {
    document.title = pageTitle === "Jelajahi Komik" ? "Daftar Komik | GaleriKomik" : `${pageTitle} | GaleriKomik`;
  }, [pageTitle]);

  // Active filter tags
  const activeFilterTags = [];
  if (genre) {
    genre.split(",").forEach((g) => {
      const found = genres.find((gn) => gn.slug === g);
      activeFilterTags.push({ label: found?.name || g, key: "genre", value: g });
    });
  }
  if (status) {
    const found = STATUS_OPTIONS.find((s) => s.value === status);
    activeFilterTags.push({ label: found?.label || status, key: "status", value: status });
  }
  if (type) {
    const found = TYPE_OPTIONS.find((t) => t.value === type);
    activeFilterTags.push({ label: found?.label || type, key: "type", value: type });
  }
  if (orderby && orderby !== "latest") {
    const found = SORT_OPTIONS.find((s) => s.value === orderby);
    activeFilterTags.push({ label: found?.label || orderby, key: "orderby", value: orderby });
  }

  return (
    <div className="min-h-screen">
      {/* ═══ Page Header ═══ */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          {/* Breadcrumb */}
          {hasFilters && (
            <nav className="flex items-center gap-1.5 text-xs text-dark-500 mb-3 flex-wrap">
              <Link href="/manhwa" onClick={clearFilters} className="hover:text-accent-400 transition-colors">
                Daftar Komik
              </Link>
              {activeFilterTags.map((tag) => (
                <span key={`${tag.key}-${tag.value}`} className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-dark-300">{tag.label}</span>
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-100 mb-2">{pageTitle}</h1>
          <p className="text-sm text-dark-400">{meta.total > 0 ? `${meta.total.toLocaleString()} judul ditemukan` : pageDescription}</p>

          {/* Active filter pills */}
          {activeFilterTags.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {activeFilterTags.map((tag) => (
                <button
                  key={`${tag.key}-${tag.value}`}
                  onClick={() => {
                    if (tag.key === "genre") {
                      const current = genre.split(",").filter((g) => g !== tag.value);
                      setGenre(current.join(","));
                    } else if (tag.key === "status") setStatus("");
                    else if (tag.key === "type") setType("");
                    else if (tag.key === "orderby") setOrderby("latest");
                    setPage(1);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-dark-800 text-accent-400 border border-dark-600 hover:border-dark-500 transition-all">
                  {tag.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              <button onClick={clearFilters} className="text-xs text-dark-500 hover:text-accent-400 transition-colors ml-1">
                Hapus Semua
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* ═══ Filters Bar ═══ */}
        <div className="solid-card rounded-xl p-4 sm:p-5 mb-6 space-y-4">
          {/* Row 1: Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari judul komik..."
                className="w-full px-4 py-3 pl-11 rounded-lg bg-dark-800 border border-dark-600 text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:border-accent-500 transition-colors"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-dark-700 flex items-center justify-center text-dark-400 hover:text-dark-100 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <select
              value={orderby}
              onChange={(e) => {
                setOrderby(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 rounded-lg bg-dark-800 border border-dark-600 text-sm text-dark-100 focus:outline-none focus:border-accent-500 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_12px_center] bg-no-repeat sm:w-44 pr-10">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Quick filters */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  setStatus(status === s.value ? "" : s.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  status === s.value ? "bg-dark-700 border-accent-500 text-accent-400" : "bg-dark-800 border-dark-700 text-dark-300 hover:border-dark-500 hover:text-dark-100"
                }`}>
                {s.label}
              </button>
            ))}

            <div className="w-px h-5 bg-dark-600 mx-1 hidden sm:block" />

            {TYPE_OPTIONS.filter((t) => t.value).map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setType(type === t.value ? "" : t.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  type === t.value ? "bg-dark-700 border-accent-500 text-accent-400" : "bg-dark-800 border-dark-700 text-dark-300 hover:border-dark-500 hover:text-dark-100"
                }`}>
                {t.label}
              </button>
            ))}

            <div className="w-px h-5 bg-dark-700/50 mx-1 hidden sm:block" />

            <button
              onClick={() => setShowGenrePanel(!showGenrePanel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                genre ? "bg-dark-700 border-accent-500 text-accent-400" : "bg-dark-800 border-dark-700 text-dark-300 hover:border-dark-500 hover:text-dark-100"
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Genre {genre ? `(${genre.split(",").length})` : ""}
              <svg className={`w-3 h-3 transition-transform ${showGenrePanel ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {hasFilters && (
              <button onClick={clearFilters} className="px-3 py-1.5 rounded-lg text-xs font-medium text-neon-red border border-dark-600 hover:border-neon-red hover:bg-dark-800 transition-colors ml-auto">
                Reset
              </button>
            )}
          </div>

          {/* Genre panel */}
          {showGenrePanel && (
            <div className="pt-3 border-t border-dark-700">
              {genres.length === 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-20 h-7 skeleton rounded-full" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleGenreToggle(g.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isGenreActive(g.slug) ? "bg-dark-700 border-accent-500 text-accent-400" : "bg-dark-800 border-dark-700 text-dark-400 hover:border-dark-500 hover:text-dark-200"
                      }`}>
                      {g.name}
                      <span className={`ml-1 text-[10px] ${isGenreActive(g.slug) ? "text-accent-500/60" : "text-dark-600"}`}>{g.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ Results info ═══ */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-dark-400">{loading ? "Memuat..." : `Menampilkan ${data.length} dari ${meta.total.toLocaleString()} komik`}</p>
          {meta.pages > 1 && (
            <p className="text-xs text-dark-500">
              Halaman {page} dari {meta.pages}
            </p>
          )}
        </div>

        {/* ═══ Results Grid ═══ */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(perPage)].map((_, i) => (
              <div key={i} className="solid-card rounded-xl overflow-hidden">
                <div className="aspect-[3/4] skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800/60 border border-dark-700/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-dark-400 font-medium mb-2">Tidak ada komik ditemukan</p>
            <p className="text-xs text-dark-500 mb-4">Coba ubah filter atau kata kunci pencarian</p>
            <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-accent-400 text-sm font-medium hover:border-dark-500 hover:text-dark-100 transition-colors">
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {data.map((comic) => (
              <ManhwaCard key={comic.id} comic={comic} />
            ))}
          </div>
        )}

        {/* ═══ Pagination ═══ */}
        {meta.pages > 1 && !loading && (
          <div className="flex items-center justify-center gap-1.5 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage(page - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-9 h-9 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:text-dark-100 hover:border-dark-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {getPageRange().map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-dark-500 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-accent-600 text-white" : "bg-dark-800 border border-dark-700 text-dark-300 hover:text-dark-100 hover:border-dark-500"}`}>
                  {p}
                </button>
              ),
            )}

            <button
              disabled={page >= meta.pages}
              onClick={() => {
                setPage(page + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-9 h-9 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-300 hover:text-dark-100 hover:border-dark-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Manhwa Card ── */
function ManhwaCard({ comic }) {
  const chapter = comic.latest_chapters?.[0];

  return (
    <Link href={`/komik/${comic.slug}`} className="solid-card rounded-xl overflow-hidden card-hover group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={comic.cover} alt={comic.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" />
        <div className="absolute inset-0 bg-dark-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${comic.status === "completed" ? "badge-completed" : "badge-ongoing"}`}>{comic.status}</span>
        </div>
        <div className="absolute top-2 right-2">
          <TypeBadge type={comic.type} size="xs" />
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <svg className="w-3 h-3 star-filled" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[10px] font-bold text-rating-gold">{comic.rating}</span>
        </div>
        {chapter && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-dark-950/80 text-dark-300">Ch. {chapter.number}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-xs sm:text-sm font-semibold text-dark-200 group-hover:text-accent-500 transition-colors line-clamp-2 leading-tight">{comic.title}</h3>
        {chapter && (
          <p className="text-[10px] text-dark-500 mt-1.5 truncate">
            {chapter.title} · {chapter.date}
          </p>
        )}
      </div>
    </Link>
  );
}

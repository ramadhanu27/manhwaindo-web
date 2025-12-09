"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface SearchFiltersProps {
  order?: string;
  type?: string;
  status?: string;
  genre?: string;
  title?: string;
}

export default function SearchFilters({ order, type, status, genre, title }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [titleInput, setTitleInput] = useState(title || "");
  const [genreInput, setGenreInput] = useState(genre || "");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("https://rdapi.vercel.app/api/genres");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setGenres(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  const buildQueryString = (newParams: any) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.title !== undefined) {
      if (newParams.title) params.set("title", newParams.title);
      else params.delete("title");
    }
    if (newParams.order !== undefined) {
      if (newParams.order) params.set("order", newParams.order);
      else params.delete("order");
    }
    if (newParams.type !== undefined) {
      if (newParams.type) params.set("type", newParams.type);
      else params.delete("type");
    }
    if (newParams.status !== undefined) {
      if (newParams.status) params.set("status", newParams.status);
      else params.delete("status");
    }
    if (newParams.genre !== undefined) {
      if (newParams.genre) params.set("genre", newParams.genre);
      else params.delete("genre");
    }

    // Reset to page 1 when filter changes
    if (newParams.page !== undefined) {
      params.set("page", newParams.page);
    } else {
      params.set("page", "1");
    }

    return `?${params.toString()}`;
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newParams: any = {};
    newParams[filterType] = value;
    router.push(`/search${buildQueryString(newParams)}`);
  };

  const handleTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newTitle = (e.target as HTMLInputElement).value;
      handleFilterChange("title", newTitle);
    }
  };

  const handleSearchClick = () => {
    handleFilterChange("title", titleInput);
  };

  // Update genreInput when genre prop changes
  useEffect(() => {
    setGenreInput(genre || "");
  }, [genre]);

  // Update titleInput when title prop changes
  useEffect(() => {
    setTitleInput(title || "");
  }, [title]);

  return (
    <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
        <h3 className="font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Pencarian
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Title */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-300">Cari Judul</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={titleInput}
              placeholder="Contoh: solo leveling"
              onKeyDown={handleTitleChange}
              onChange={(e) => setTitleInput(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-[#2a3142] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <button onClick={handleSearchClick} className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Order Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-300">Urutkan</label>
          <select
            value={order || ""}
            onChange={(e) => handleFilterChange("order", e.target.value)}
            className="w-full px-3 py-2.5 bg-[#2a3142] border border-gray-700 rounded-lg text-sm cursor-pointer text-white focus:outline-none focus:border-green-500 transition-colors">
            <option value="" className="bg-[#2a3142]">
              Semua
            </option>
            <option value="update" className="bg-[#2a3142]">
              Update Terbaru
            </option>
            <option value="popular" className="bg-[#2a3142]">
              Populer
            </option>
            <option value="latest" className="bg-[#2a3142]">
              Terbaru
            </option>
            <option value="title" className="bg-[#2a3142]">
              Judul A-Z
            </option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-300">Tipe</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
              <input type="radio" name="type" value="" checked={!type} onChange={(e) => handleFilterChange("type", e.target.value)} className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500" />
              <span className="text-sm text-white">Semua</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
              <input type="radio" name="type" value="manhwa" checked={type === "manhwa"} onChange={(e) => handleFilterChange("type", e.target.value)} className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500" />
              <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-purple-600">Manhwa</span>
              <span className="text-xs text-gray-500">(Korea)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
              <input type="radio" name="type" value="manga" checked={type === "manga"} onChange={(e) => handleFilterChange("type", e.target.value)} className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500" />
              <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-blue-600">Manga</span>
              <span className="text-xs text-gray-500">(Jepang)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
              <input type="radio" name="type" value="manhua" checked={type === "manhua"} onChange={(e) => handleFilterChange("type", e.target.value)} className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500" />
              <span className="px-2 py-0.5 rounded text-xs font-medium text-white bg-orange-600">Manhua</span>
              <span className="text-xs text-gray-500">(China)</span>
            </label>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-300">Status</label>
          <select
            value={status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2.5 bg-[#2a3142] border border-gray-700 rounded-lg text-sm cursor-pointer text-white focus:outline-none focus:border-green-500 transition-colors">
            <option value="" className="bg-[#2a3142]">
              Semua
            </option>
            <option value="ongoing" className="bg-[#2a3142]">
              Ongoing
            </option>
            <option value="completed" className="bg-[#2a3142]">
              Completed
            </option>
            <option value="hiatus" className="bg-[#2a3142]">
              Hiatus
            </option>
          </select>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="text-sm font-medium block mb-2 text-gray-300">Genre</label>
          <select
            value={genreInput}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
            disabled={loadingGenres}
            className="w-full px-3 py-2.5 bg-[#2a3142] border border-gray-700 rounded-lg text-sm cursor-pointer text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="" className="bg-[#2a3142]">
              {loadingGenres ? "Memuat genre..." : "Semua Genre"}
            </option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug} className="bg-[#2a3142]">
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <button onClick={() => router.push("/search")} className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filter
        </button>
      </div>
    </div>
  );
}

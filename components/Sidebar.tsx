"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface PopularManga {
  slug: string;
  title: string;
  image: string;
  genres?: string[];
  rating?: string;
}

interface SidebarProps {
  popularManga?: PopularManga[];
}

export default function Sidebar({ popularManga = [] }: SidebarProps) {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "alltime">("monthly");

  const genres = [
    "All",
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Harem",
    "Horror",
    "Isekai",
    "Martial Arts",
    "Mystery",
    "Romance",
    "School Life",
    "Sci-Fi",
    "Seinen",
    "Shoujo",
    "Shounen",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ];

  const statuses = ["All", "Ongoing", "Completed", "Hiatus"];
  const types = ["All", "Manga", "Manhwa", "Manhua"];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedGenre !== "all") params.set("genre", selectedGenre);
    if (selectedStatus !== "all") params.set("status", selectedStatus);
    if (selectedType !== "all") params.set("type", selectedType);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Filter Search Card */}
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] px-4 py-3">
          <h3 className="text-white font-semibold">Filter Search</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Genre Dropdown */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#2a3142] text-sm text-white rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 appearance-none cursor-pointer">
              <option value="all">Genre All ▼</option>
              {genres.slice(1).map((genre) => (
                <option key={genre} value={genre.toLowerCase().replace(" ", "-")}>
                  {genre}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#2a3142] text-sm text-white rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 appearance-none cursor-pointer">
              <option value="all">Status All ▼</option>
              {statuses.slice(1).map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#2a3142] text-sm text-white rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 appearance-none cursor-pointer">
            <option value="all">Type All ▼</option>
            {types.slice(1).map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button onClick={handleSearch} className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/20">
            Search
          </button>
        </div>
      </div>

      {/* Manga Popular Card */}
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] px-4 py-3">
          <h3 className="text-white font-semibold">Manga Popular</h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { key: "weekly" as const, label: "Mingguan" },
            { key: "monthly" as const, label: "Bulanan" },
            { key: "alltime" as const, label: "All Time" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-green-500 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Popular List */}
        <div className="p-4 space-y-4">
          {popularManga.length > 0 ? (
            popularManga.slice(0, 10).map((manga, index) => (
              <Link key={manga.slug} href={`/series/${manga.slug}`} className="flex gap-3 group">
                {/* Rank Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden bg-gray-800">
                  <img src={manga.image} alt={manga.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white group-hover:text-green-400 transition-colors line-clamp-2">{manga.title}</h4>
                  {manga.genres && manga.genres.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      Genre:{" "}
                      {manga.genres.slice(0, 3).map((g, i) => (
                        <span key={g}>
                          <span className="text-green-400 hover:underline">{g}</span>
                          {i < Math.min(manga.genres!.length, 3) - 1 && ", "}
                        </span>
                      ))}
                    </p>
                  )}
                  {manga.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-3 h-3 ${star <= Math.round(parseFloat(manga.rating!) / 2) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{manga.rating}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">No popular manga available</div>
          )}
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getReadingProgress, getBookmarks, getFavorites, clearReadingProgress, removeBookmark, removeFromFavorites, formatDate, type ReadingProgress, type BookmarkedChapter, type FavoriteSeries } from "@/lib/bookmark-storage";

type Tab = "continue" | "bookmarks" | "favorites";

export default function BookmarkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("continue");
  const [continueReading, setContinueReading] = useState<ReadingProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedChapter[]>([]);
  const [favorites, setFavorites] = useState<FavoriteSeries[]>([]);

  const loadData = useCallback(() => {
    setContinueReading(getReadingProgress());
    setBookmarks(getBookmarks());
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClearProgress = (seriesSlug: string) => {
    clearReadingProgress(seriesSlug);
    loadData();
  };

  const handleRemoveBookmark = (seriesSlug: string, chapterSlug: string) => {
    removeBookmark(seriesSlug, chapterSlug);
    loadData();
  };

  const handleRemoveFavorite = (seriesSlug: string) => {
    removeFromFavorites(seriesSlug);
    loadData();
  };

  const tabs = [
    { key: "continue" as const, label: "Continue Reading", count: continueReading.length, icon: "📖" },
    { key: "bookmarks" as const, label: "Bookmarks", count: bookmarks.length, icon: "🔖" },
    { key: "favorites" as const, label: "Favorites", count: favorites.length, icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1319]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Library</h1>
            <p className="text-gray-400">Kelola reading progress, bookmark, dan favorit kamu</p>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-4 font-medium transition-all text-sm md:text-base flex items-center justify-center gap-2 ${activeTab === tab.key ? "bg-green-500 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <span className="hidden md:inline">{tab.icon}</span>
                {tab.label}
                {tab.count > 0 && <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-gray-700"}`}>{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Reading Tab */}
        {activeTab === "continue" && (
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
              <h2 className="text-lg font-bold text-white">Continue Reading</h2>
            </div>

            <div className="p-4">
              {continueReading.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No reading progress yet</h3>
                  <p className="text-gray-400 mb-6">Start reading to track your progress here</p>
                  <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Manga
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {continueReading.map((item) => (
                    <div key={`${item.seriesSlug}-${item.chapterSlug}`} className="flex gap-4 p-3 bg-[#2a3142] rounded-lg hover:ring-2 hover:ring-green-500/50 transition-all group">
                      {item.seriesImage && (
                        <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
                          <Image src={item.seriesImage} alt={item.seriesTitle} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-green-400 transition-colors">{item.seriesTitle}</h3>
                        <p className="text-sm text-gray-400 mb-1">Last read: {item.chapterTitle}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.lastReadAt)}</p>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/series/${item.seriesSlug}/${item.chapterSlug}`} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Continue
                          </Link>
                          <button onClick={() => handleClearProgress(item.seriesSlug)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
              <h2 className="text-lg font-bold text-white">Bookmarked Chapters</h2>
            </div>

            <div className="p-4">
              {bookmarks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔖</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
                  <p className="text-gray-400 mb-6">Bookmark your favorite chapters to find them easily</p>
                  <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Manga
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((item) => (
                    <div key={`${item.seriesSlug}-${item.chapterSlug}`} className="flex gap-4 p-3 bg-[#2a3142] rounded-lg hover:ring-2 hover:ring-green-500/50 transition-all group">
                      {item.seriesImage && (
                        <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-700">
                          <Image src={item.seriesImage} alt={item.seriesTitle} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-green-400 transition-colors">{item.seriesTitle}</h3>
                        <p className="text-sm text-gray-400 mb-1">{item.chapterTitle}</p>
                        <p className="text-xs text-gray-500">Bookmarked {formatDate(item.bookmarkedAt)}</p>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/series/${item.seriesSlug}/${item.chapterSlug}`} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Read
                          </Link>
                          <button onClick={() => handleRemoveBookmark(item.seriesSlug, item.chapterSlug)} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
              <h2 className="text-lg font-bold text-white">Favorite Series</h2>
            </div>

            <div className="p-4">
              {favorites.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                  <p className="text-gray-400 mb-6">Add series to favorites to access them quickly</p>
                  <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Manga
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {favorites.map((item) => (
                    <div key={item.slug} className="group relative bg-[#2a3142] rounded-lg overflow-hidden hover:ring-2 hover:ring-green-500/50 transition-all">
                      <Link href={`/series/${item.slug}`}>
                        {item.image && (
                          <div className="relative aspect-[2/3] overflow-hidden bg-gray-700">
                            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-white line-clamp-2 mb-1 group-hover:text-green-400 transition-colors">{item.title}</h3>
                          <p className="text-xs text-gray-500">Added {formatDate(item.addedAt)}</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite(item.slug)}
                        className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm text-red-400 rounded-lg hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from favorites">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

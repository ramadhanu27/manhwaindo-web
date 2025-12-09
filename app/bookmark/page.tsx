"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getReadingProgress, getBookmarks, getFavorites, clearReadingProgress, removeBookmark, removeFromFavorites, formatDate, type ReadingProgress, type BookmarkedChapter, type FavoriteSeries } from "@/lib/bookmark-storage";

type Tab = "continue" | "bookmarks" | "favorites";

export default function BookmarkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("continue");
  const [continueReading, setContinueReading] = useState<ReadingProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedChapter[]>([]);
  const [favorites, setFavorites] = useState<FavoriteSeries[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setContinueReading(getReadingProgress());
    setBookmarks(getBookmarks());
    setFavorites(getFavorites());
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-3">My Library</h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Kelola reading progress, bookmark, dan favorit kamu</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button onClick={() => setActiveTab("continue")} className={`px-6 py-3 font-medium transition-all relative ${activeTab === "continue" ? "text-primary" : "text-slate-400 hover:text-slate-200"}`}>
            Continue Reading
            {continueReading.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">{continueReading.length}</span>}
            {activeTab === "continue" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
          </button>

          <button onClick={() => setActiveTab("bookmarks")} className={`px-6 py-3 font-medium transition-all relative ${activeTab === "bookmarks" ? "text-primary" : "text-slate-400 hover:text-slate-200"}`}>
            Bookmarks
            {bookmarks.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">{bookmarks.length}</span>}
            {activeTab === "bookmarks" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
          </button>

          <button onClick={() => setActiveTab("favorites")} className={`px-6 py-3 font-medium transition-all relative ${activeTab === "favorites" ? "text-primary" : "text-slate-400 hover:text-slate-200"}`}>
            Favorites
            {favorites.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">{favorites.length}</span>}
            {activeTab === "favorites" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
          </button>
        </div>

        {/* Continue Reading Tab */}
        {activeTab === "continue" && (
          <div className="space-y-4">
            {continueReading.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No reading progress yet</h3>
                <p className="text-slate-400">Start reading to track your progress here</p>
              </div>
            ) : (
              continueReading.map((item) => (
                <div
                  key={`${item.seriesSlug}-${item.chapterSlug}`}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/30 border border-slate-700/50 p-4 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    {item.seriesImage && (
                      <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={item.seriesImage} alt={item.seriesTitle} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-100 mb-1">{item.seriesTitle}</h3>
                      <p className="text-sm text-slate-400 mb-2">Last read: {item.chapterTitle}</p>
                      <p className="text-xs text-slate-500">{formatDate(item.lastReadAt)}</p>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/manga/${item.seriesSlug}/${item.chapterSlug}`} className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                          Continue Reading
                        </Link>
                        <button onClick={() => handleClearProgress(item.seriesSlug)} className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔖</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No bookmarks yet</h3>
                <p className="text-slate-400">Bookmark your favorite chapters to find them easily</p>
              </div>
            ) : (
              bookmarks.map((item) => (
                <div
                  key={`${item.seriesSlug}-${item.chapterSlug}`}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/30 border border-slate-700/50 p-4 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    {item.seriesImage && (
                      <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={item.seriesImage} alt={item.seriesTitle} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-100 mb-1">{item.seriesTitle}</h3>
                      <p className="text-sm text-slate-400 mb-2">{item.chapterTitle}</p>
                      <p className="text-xs text-slate-500">Bookmarked {formatDate(item.bookmarkedAt)}</p>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/manga/${item.seriesSlug}/${item.chapterSlug}`} className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
                          Read Chapter
                        </Link>
                        <button onClick={() => handleRemoveBookmark(item.seriesSlug, item.chapterSlug)} className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No favorites yet</h3>
                <p className="text-slate-400">Add series to favorites to access them quickly</p>
              </div>
            ) : (
              favorites.map((item) => (
                <div key={item.slug} className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-800/50 to-slate-900/30 border border-slate-700/50 hover:border-primary/50 transition-all">
                  <Link href={`/manga/${item.slug}`}>
                    {item.image && (
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-slate-100 line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500">Added {formatDate(item.addedAt)}</p>
                    </div>
                  </Link>
                  <button onClick={() => handleRemoveFavorite(item.slug)} className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" title="Remove from favorites">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

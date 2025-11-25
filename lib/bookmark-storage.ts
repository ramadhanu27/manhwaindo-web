/**
 * Bookmark and Reading Progress Management
 * Uses localStorage for persistent storage
 */

export interface ReadingProgress {
  seriesSlug: string;
  seriesTitle: string;
  seriesImage?: string;
  chapterSlug: string;
  chapterTitle: string;
  lastReadAt: string; // ISO date string
  pageNumber?: number; // For future online reader
}

export interface BookmarkedChapter {
  seriesSlug: string;
  seriesTitle: string;
  seriesImage?: string;
  chapterSlug: string;
  chapterTitle: string;
  bookmarkedAt: string; // ISO date string
}

const STORAGE_KEYS = {
  READING_PROGRESS: "manhwaindo_reading_progress",
  BOOKMARKS: "manhwaindo_bookmarks",
  FAVORITES: "manhwaindo_favorites",
};

// Reading Progress Functions
export function saveReadingProgress(progress: ReadingProgress): void {
  try {
    const existing = getReadingProgress();
    // Remove old progress for same series if exists
    const filtered = existing.filter((p) => p.seriesSlug !== progress.seriesSlug);
    // Add new progress at the beginning
    const updated = [{ ...progress, lastReadAt: new Date().toISOString() }, ...filtered];
    // Keep only last 50 items
    const limited = updated.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(limited));
  } catch (error) {
    console.error("Failed to save reading progress:", error);
  }
}

export function getReadingProgress(): ReadingProgress[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get reading progress:", error);
    return [];
  }
}

export function getSeriesProgress(seriesSlug: string): ReadingProgress | null {
  const progress = getReadingProgress();
  return progress.find((p) => p.seriesSlug === seriesSlug) || null;
}

export function clearReadingProgress(seriesSlug: string): void {
  try {
    const progress = getReadingProgress();
    const filtered = progress.filter((p) => p.seriesSlug !== seriesSlug);
    localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to clear reading progress:", error);
  }
}

// Bookmark Functions
export function addBookmark(bookmark: BookmarkedChapter): void {
  try {
    const existing = getBookmarks();
    // Check if already bookmarked
    const isBookmarked = existing.some((b) => b.seriesSlug === bookmark.seriesSlug && b.chapterSlug === bookmark.chapterSlug);
    if (isBookmarked) return;

    const updated = [{ ...bookmark, bookmarkedAt: new Date().toISOString() }, ...existing];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to add bookmark:", error);
  }
}

export function removeBookmark(seriesSlug: string, chapterSlug: string): void {
  try {
    const existing = getBookmarks();
    const filtered = existing.filter((b) => !(b.seriesSlug === seriesSlug && b.chapterSlug === chapterSlug));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove bookmark:", error);
  }
}

export function getBookmarks(): BookmarkedChapter[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get bookmarks:", error);
    return [];
  }
}

export function isChapterBookmarked(seriesSlug: string, chapterSlug: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.seriesSlug === seriesSlug && b.chapterSlug === chapterSlug);
}

export function getSeriesBookmarks(seriesSlug: string): BookmarkedChapter[] {
  const bookmarks = getBookmarks();
  return bookmarks.filter((b) => b.seriesSlug === seriesSlug);
}

// Favorite Series Functions
export interface FavoriteSeries {
  slug: string;
  title: string;
  image?: string;
  addedAt: string;
}

export function addToFavorites(series: Omit<FavoriteSeries, "addedAt">): void {
  try {
    const existing = getFavorites();
    const isFavorite = existing.some((f) => f.slug === series.slug);
    if (isFavorite) return;

    const updated = [{ ...series, addedAt: new Date().toISOString() }, ...existing];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to add to favorites:", error);
  }
}

export function removeFromFavorites(seriesSlug: string): void {
  try {
    const existing = getFavorites();
    const filtered = existing.filter((f) => f.slug !== seriesSlug);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove from favorites:", error);
  }
}

export function getFavorites(): FavoriteSeries[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return [];
  }
}

export function isFavorite(seriesSlug: string): boolean {
  const favorites = getFavorites();
  return favorites.some((f) => f.slug === seriesSlug);
}

// Utility function to format date
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Unknown";
  }
}

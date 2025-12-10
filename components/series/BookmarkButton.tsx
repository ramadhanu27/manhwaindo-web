"use client";

import { useState, useEffect } from "react";
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/bookmark-storage";

interface BookmarkButtonProps {
  seriesSlug: string;
  seriesTitle: string;
  seriesImage?: string;
}

export default function BookmarkButton({ seriesSlug, seriesTitle, seriesImage }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if series is already bookmarked
    setIsBookmarked(isFavorite(seriesSlug));
  }, [seriesSlug]);

  const handleBookmarkClick = () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        removeFromFavorites(seriesSlug);
        setIsBookmarked(false);
      } else {
        addToFavorites({
          slug: seriesSlug,
          title: seriesTitle,
          image: seriesImage,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={loading}
      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
        isBookmarked ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/20"
      } disabled:opacity-50 disabled:cursor-not-allowed`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
      {isBookmarked ? "Bookmarked ✓" : "Bookmark"}
    </button>
  );
}

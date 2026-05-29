import Image from "next/image";
import Link from "next/link";
import TypeBadge from "./TypeBadge";

export default function SidebarPopularCard({ comic, rank }) {
  // Premium rank badge styles
  const getRankBadgeStyle = (r) => {
    if (r === 1) return "from-yellow-400 to-amber-500 text-dark-950 font-black shadow-lg shadow-yellow-500/20 scale-105 border border-yellow-300/50";
    if (r === 2) return "from-slate-300 to-slate-400 text-dark-950 font-black shadow-lg shadow-slate-400/20 scale-105 border border-slate-200/50";
    if (r === 3) return "from-amber-600 to-amber-700 text-white font-black shadow-lg shadow-amber-700/20 scale-105 border border-amber-500/50";
    return "bg-dark-800 text-dark-300 border border-dark-600";
  };

  // Format rank number to 01, 02, etc.
  const formattedRank = rank < 10 ? `0${rank}` : rank;

  return (
    <Link
      href={`/komik/${comic.slug}`}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-800/50 transition-all duration-200 group relative border-b border-dark-800/70 last:border-none pb-3 pt-1 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-accent-600 before:rounded-r before:scale-y-0 hover:before:scale-y-100 before:transition-transform before:duration-200 before:origin-center"
    >
      {/* Cover Image with Rank Badge */}
      <div className="relative w-[50px] h-[68px] rounded-lg overflow-hidden flex-shrink-0 border border-dark-700/80 shadow-md transition-all duration-300 group-hover:border-accent-500/40 group-hover:shadow-lg group-hover:shadow-black/40">
        <Image
          src={comic.cover}
          alt={comic.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="50px"
        />
        
        {/* Leaderboard Rank Badge */}
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-md bg-gradient-to-br flex items-center justify-center shadow-md ${getRankBadgeStyle(rank)}`}>
          <span className="text-[10px] font-black">{rank}</span>
        </div>
      </div>

      {/* Series Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-dark-200 group-hover:text-accent-400 transition-colors truncate">
          {comic.title}
        </h4>
        
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {/* Rating */}
          {comic.rating && (
            <div className="flex items-center gap-0.5 text-[11px] text-dark-400 font-semibold">
              <svg className="w-3 h-3 star-filled" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-rating-gold">{comic.rating}</span>
            </div>
          )}

          {/* Dot separator if both exist */}
          {comic.rating && comic.type && <span className="text-[10px] text-dark-600">•</span>}

          {/* Type Badge or Label */}
          {comic.type && (
            <span className="text-[10px] font-semibold text-dark-400 group-hover:text-dark-300 transition-colors uppercase">
              {comic.type}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

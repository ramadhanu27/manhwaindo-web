import Image from "next/image";
import Link from "next/link";

// Map flag images directly for easy access
const FLAG_MAP = {
  Manhwa: "/korea.png",
  Manga: "/japan.png",
  Manhua: "/china.png",
};

export default function HotUpdateCard({ comic }) {
  // Determine color format dynamically based on type (Indonesian)
  const isBlackAndWhite = comic.type === "Manga";
  const colorFormat = isBlackAndWhite ? "Hitam Putih" : "Warna";

  // Format views to Indonesian 'rb' format
  const formattedViews = (() => {
    if (!comic.views) return "0";
    if (comic.views >= 1000) {
      return `${Math.round(comic.views / 1000)} rb`;
    }
    return comic.views.toLocaleString();
  })();

  const flagUrl = FLAG_MAP[comic.type] || "/korea.png";

  return (
    <div className="solid-card rounded-xl p-3.5 bg-dark-800 border border-dark-700/60 flex flex-col justify-between h-[142px] card-hover group">
      {/* Top Section: Circle Image + Details */}
      <div className="flex gap-3 items-center">
        {/* Circle Thumbnail */}
        <Link href={`/komik/${comic.slug}`} className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 relative border border-dark-600/80 block group-hover:scale-105 transition-transform duration-300">
          <Image
            src={comic.cover}
            alt={comic.title}
            fill
            className="object-cover"
            sizes="56px"
          />
        </Link>

        {/* Info Area */}
        <div className="flex-1 min-w-0">
          <Link href={`/komik/${comic.slug}`} className="text-sm font-bold text-dark-100 line-clamp-1 group-hover:text-accent-500 transition-colors leading-snug block">
            {comic.title}
          </Link>
          
          {/* Sub-info list (Rating, Type, Views, Format) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-dark-400 font-medium">
            {/* Rating */}
            {comic.rating && (
              <span className="flex items-center gap-0.5 text-rating-gold">
                <svg className="w-3 h-3 star-filled" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {comic.rating}
              </span>
            )}
            
            <span className="text-dark-600 font-bold">•</span>

            {/* Type with Flag */}
            <span className="flex items-center gap-1">
              <Image src={flagUrl} alt={comic.type} width={13} height={10} className="rounded-[1px] object-cover flex-shrink-0" />
              {comic.type}
            </span>

            <span className="text-dark-600 font-bold">•</span>

            {/* Views */}
            <span className="flex items-center gap-0.5">
              <svg className="w-3 h-3 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formattedViews}
            </span>

            <span className="text-dark-600 font-bold">•</span>

            {/* Format (Warna / Hitam Putih) */}
            <span>{colorFormat}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Status Badge (left) & Chapters (right) */}
      <div className="flex items-center justify-between border-t border-dark-700/60 pt-2 mt-1">
        {/* Status dot indicator */}
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${comic.status === "completed" ? "bg-accent-500/10 text-accent-400 border border-accent-500/20" : "bg-neon-green/10 text-neon-green border border-neon-green/20"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${comic.status === "completed" ? "bg-accent-400" : "bg-neon-green pulse-dot"}`} />
          {comic.status}
        </span>

        {/* Chapters list horizontally aligned to right */}
        {comic.latest_chapters && comic.latest_chapters.length > 0 && (
          <div className="flex items-center gap-3 max-w-[65%] min-w-0 justify-end">
            {comic.latest_chapters.slice(0, 3).map((ch, i) => (
              <a
                key={i}
                href={`/komik/${comic.slug}/${ch.slug}`}
                className="text-[10px] sm:text-xs font-semibold text-dark-300 hover:text-accent-500 transition-colors truncate whitespace-nowrap block"
              >
                {ch.title.replace(/Chapter\s*/i, "Ch. ")}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

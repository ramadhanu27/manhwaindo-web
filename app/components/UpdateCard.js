import Image from "next/image";
import TypeBadge from "./TypeBadge";

export default function UpdateCard({ comic }) {
  return (
    <div className="solid-card rounded-lg overflow-hidden card-hover group flex flex-col h-full bg-dark-800 border border-dark-700/60">
      {/* Cover image area */}
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <a href={`/komik/${comic.slug}`} className="block w-full h-full">
          <Image
            src={comic.cover}
            alt={comic.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 180px"
          />
          {/* Solid overlay on hover */}
          <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>

        {/* Rating Badge */}
        {comic.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-dark-950/80 text-[10px] font-bold text-rating-gold">
            <svg className="w-2.5 h-2.5 star-filled" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{comic.rating}</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute bottom-2 left-2">
          <TypeBadge type={comic.type} size="xs" />
        </div>
      </div>

      {/* Info & Chapters */}
      <div className="p-2 flex-1 flex flex-col justify-between">
        {/* Title */}
        <div className="mb-2">
          <a
            href={`/komik/${comic.slug}`}
            className="text-xs sm:text-sm font-bold text-dark-100 line-clamp-2 group-hover:text-accent-500 transition-colors leading-tight"
            title={comic.title}
          >
            {comic.title}
          </a>
        </div>

        {/* Chapters list underneath */}
        {comic.latest_chapters && comic.latest_chapters.length > 0 && (
          <div className="flex flex-col gap-1 mt-auto">
            {comic.latest_chapters.slice(0, 3).map((ch, i) => (
              <a
                key={i}
                href={`/komik/${comic.slug}/${ch.slug}`}
                className="flex items-center justify-between px-2 py-1 rounded bg-dark-900 border border-dark-700/50 hover:bg-accent-500/10 hover:border-accent-500/30 group/ch transition-all"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-dark-200 group-hover/ch:text-accent-500 transition-colors truncate max-w-[65%]">
                  {ch.title.replace(/Chapter\s*/i, "Ch. ")}
                </span>
                <span className="text-[9px] sm:text-[10px] text-dark-400 group-hover/ch:text-accent-400/80 transition-colors flex-shrink-0">
                  {ch.date}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

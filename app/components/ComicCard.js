import Image from "next/image";
import TypeBadge from "./TypeBadge";

export default function ComicCard({ comic, rank }) {
  return (
    <a href={`/komik/${comic.slug}`} className="solid-card rounded-xl overflow-hidden card-hover group block">
      {/* Cover image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image src={comic.cover} alt={comic.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px" />
        {/* Solid overlay on hover */}
        <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rank badge */}
        {rank != null && (
          <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">#{rank}</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${comic.status === "completed" ? "badge-completed" : "badge-ongoing"}`}>{comic.status}</span>
        </div>

        {/* Type badge */}
        <div className="absolute bottom-2 left-2">
          <TypeBadge type={comic.type} size="xs" />
        </div>

        {/* Views */}
        {comic.views && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-950/80">
            <svg className="w-3 h-3 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[10px] font-medium text-dark-200">{comic.views.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-dark-100 line-clamp-2 group-hover:text-accent-500 transition-colors leading-snug mb-2">{comic.title}</h3>
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 star-filled" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-medium text-rating-gold">{comic.rating}</span>
        </div>
      </div>
    </a>
  );
}

import Link from "next/link";
import ReaderClient from "./ReaderClient";
import { fetchApi } from "@/app/lib/api";

export default async function ChapterReaderPage({ params }) {
  const { slug, chapterSlug } = await params;

  let data = null;
  try {
    const res = await fetchApi(`chapter/${slug}/${chapterSlug}`, {}, { next: { revalidate: 3600 } });
    if (res.success) data = res.data;
  } catch (err) {
    console.error("Error fetching chapter on server:", err);
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-red/20 to-neon-orange/10 border border-neon-red/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-neon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark-200 mb-2">Chapter Tidak Ditemukan</h2>
          <p className="text-sm text-dark-400 mb-6">Chapter yang kamu cari tidak ada.</p>
          <Link href={`/komik/${slug}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Detail
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* ═══ Top Navigation Bar ═══ */}
      <div className="glass border-b border-dark-700/30 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-dark-400 mb-2 flex-wrap">
            <Link href="/" className="hover:text-accent-400 transition-colors flex-shrink-0">
              Home
            </Link>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/komik/${data.manhwa_slug}`} className="hover:text-accent-400 transition-colors truncate max-w-[120px] sm:max-w-[250px] flex-shrink-0">
              {data.manhwa_title}
            </Link>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-accent-400 font-medium truncate max-w-[120px] sm:max-w-[250px]">{data.chapter_title}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {data.navigation.prev_slug ? (
              <Link
                href={`/komik/${data.manhwa_slug}/${data.navigation.prev_slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-dark-300 hover:text-accent-400 hover:border-accent-500/30 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Prev</span>
              </Link>
            ) : (
              <div className="px-4 py-2 rounded-xl text-sm font-medium text-dark-600 cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            )}

            <div className="flex-1 text-center min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-dark-100 truncate">{data.chapter_title}</h1>
              <p className="text-[10px] sm:text-xs text-dark-400 truncate">{data.manhwa_title}</p>
            </div>

            {data.navigation.next_slug ? (
              <Link
                href={`/komik/${data.manhwa_slug}/${data.navigation.next_slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-dark-300 hover:text-accent-400 hover:border-accent-500/30 transition-all">
                <span className="hidden sm:inline">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="px-4 py-2 rounded-xl text-sm font-medium text-dark-600 cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Reader Images ═══ */}
      <ReaderClient images={data.images} manhwaSlug={data.manhwa_slug} manhwaTitle={data.manhwa_title} chapterTitle={data.chapter_title} prevSlug={data.navigation.prev_slug} nextSlug={data.navigation.next_slug} />

      {/* ═══ Bottom Navigation ═══ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            {data.navigation.prev_slug ? (
              <Link
                href={`/komik/${data.manhwa_slug}/${data.navigation.prev_slug}`}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-xl glass text-xs sm:text-sm font-semibold text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all flex-1 sm:flex-initial justify-center sm:justify-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Chapter Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <div className="flex-1 sm:flex-initial" />
            )}

            <Link href={`/komik/${data.manhwa_slug}`} className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-xl bg-accent-600 text-white text-xs sm:text-sm font-semibold hover:bg-accent-500 transition-colors flex-initial justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Daftar Chapter</span>
              <span className="sm:hidden">Chapters</span>
            </Link>

            {data.navigation.next_slug ? (
              <Link
                href={`/komik/${data.manhwa_slug}/${data.navigation.next_slug}`}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-xl glass text-xs sm:text-sm font-semibold text-dark-200 hover:text-accent-400 hover:border-accent-500/30 transition-all flex-1 sm:flex-initial justify-center sm:justify-start">
                <span className="hidden sm:inline">Chapter Selanjutnya</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="flex-1 sm:flex-initial" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { getChapterImages, getSeriesDetail } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { extractSeriesSlug, encodeSlug } from "@/lib/slug-utils";
import ChapterNavigation from "@/components/ChapterNavigation";

export default async function ChapterPage({ params }: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await params;
  const cleanedSlug = extractSeriesSlug(decodeURIComponent(slug));
  const cleanedChapter = extractSeriesSlug(decodeURIComponent(chapter));

  // Fetch chapter data and series data in parallel
  const [chapterResponse, seriesResponse] = await Promise.all([getChapterImages(cleanedChapter), getSeriesDetail(cleanedSlug)]);

  // Validate chapter slug
  if (!chapter || chapter.trim() === "") {
    return (
      <div className="min-h-screen bg-[#0f1319] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Invalid Chapter</h1>
          <p className="text-gray-400 mb-4">Chapter slug is empty or invalid.</p>
          <Link href={`/series/${encodeSlug(cleanedSlug)}`} className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const chapterData = chapterResponse?.data || chapterResponse || {};
  const images = chapterData?.images || [];
  const seriesData = seriesResponse?.data || {};
  const seriesTitle = seriesData?.title || cleanedSlug.replace(/-/g, " ");
  const chapters = seriesData?.chapters || [];

  if (!chapterResponse?.success || !images || images.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1319] flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Chapter Not Found</h1>
          <p className="text-gray-400 mb-4">Unable to load chapter images. The API may not have returned any data.</p>
          <Link href={`/series/${encodeSlug(cleanedSlug)}`} className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const chapterTitle = chapterData.title || cleanedChapter.replace(/-/g, " ");
  // API returns prev/next in reverse order, so we swap them
  const prevChapter = chapterData.nextChapter;
  const nextChapter = chapterData.prevChapter;

  return (
    <div className="min-h-screen bg-[#0f1319]">
      {/* Header Section */}
      <div className="bg-[#1a1f2e] border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          {/* Chapter Title */}
          <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
            {seriesTitle} {chapterTitle}
          </h1>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button className="px-3 py-1.5 bg-[#3b5998] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
              Facebook
            </button>
            <button className="px-3 py-1.5 bg-[#1da1f2] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
              Twitter
            </button>
            <button className="px-3 py-1.5 bg-[#25d366] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Whatsapp
            </button>
            <button className="px-3 py-1.5 bg-[#e60023] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
              </svg>
              Pinterest
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href={`/series/${encodeSlug(cleanedSlug)}`} className="hover:text-green-400 transition-colors text-green-400">
              {seriesTitle}
            </Link>
            <span>›</span>
            <span className="text-white">{chapterTitle}</span>
          </div>

          {/* Description Text */}
          <div className="max-w-3xl mx-auto text-center mb-6">
            <p className="text-sm text-gray-400">
              Baca manga <span className="text-green-400 font-semibold">{chapterTitle} Bahasa Indonesia</span> terbaru di ManhwaIndo. Manga{" "}
              <Link href={`/series/${encodeSlug(cleanedSlug)}`} className="text-green-400 hover:underline font-semibold">
                {seriesTitle}
              </Link>{" "}
              bahasa Indonesia selalu update di <span className="text-green-400">ManhwaIndo</span>. Jangan lupa membaca update manga lainnya ya. Daftar koleksi manga <span className="text-green-400">ManhwaIndo</span> ada di menu Daftar
              Manga.
            </p>
          </div>

          {/* Chapter Navigation */}
          <ChapterNavigation currentChapter={cleanedChapter} chapters={chapters} seriesSlug={cleanedSlug} prevChapter={prevChapter} nextChapter={nextChapter} />
        </div>
      </div>

      {/* Chapter Images */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg overflow-hidden">
          {images.map((imageUrl: string, idx: number) => (
            <div key={idx} className="relative w-full">
              <img src={imageUrl} alt={`Page ${idx + 1}`} className="w-full h-auto" loading={idx < 3 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8">
          <ChapterNavigation currentChapter={cleanedChapter} chapters={chapters} seriesSlug={cleanedSlug} prevChapter={prevChapter} nextChapter={nextChapter} />
        </div>
      </div>
    </div>
  );
}

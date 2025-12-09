import { getSeriesDetail, getPopular } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChaptersSection from "@/components/ChaptersSection";
import BookmarkButton from "@/components/BookmarkButton";
import Sidebar from "@/components/Sidebar";
import { extractSeriesSlug, cleanSlug, encodeSlug } from "@/lib/slug-utils";

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanedSlug = extractSeriesSlug(decodeURIComponent(slug));

  const [data, popularData] = await Promise.all([getSeriesDetail(cleanedSlug), getPopular()]);

  if (!data.success || !data.data) {
    notFound();
  }

  const series = data.data;
  const firstChapter = series.chapters?.[0];
  const latestChapter = series.chapters?.[series.chapters.length - 1];

  // Prepare popular manga for sidebar
  const popularSeries = popularData.success ? popularData.data : [];
  const sidebarPopularManga = popularSeries.slice(0, 10).map((s: any) => ({
    slug: s.slug,
    title: s.title,
    image: s.image,
    genres: s.genres || [],
    rating: s.rating,
  }));

  return (
    <div className="min-h-screen bg-[#0f1319]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Series Detail Card */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
              {/* Title Header */}
              <div className="px-6 py-4 border-b border-gray-800">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{series.title}</h1>
                {series.alternativeTitle && <p className="text-gray-400 text-sm mt-1">{series.alternativeTitle}</p>}
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left - Cover Image & Actions */}
                  <div className="flex-shrink-0 w-full md:w-48">
                    {/* Cover Image */}
                    <div className="relative w-full md:w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-xl mb-4 border border-gray-700">
                      <Image src={series.image || "/placeholder.jpg"} alt={series.title} fill className="object-cover" priority />
                    </div>

                    {/* Rating Stars */}
                    {series.rating && (
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-5 h-5 ${star <= Math.round(parseFloat(series.rating) / 2) ? "text-yellow-400" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-yellow-400 font-bold ml-1">{series.rating}</span>
                      </div>
                    )}

                    {/* Views */}
                    <p className="text-center text-gray-400 text-sm mb-4">{series.views || "0"} Dilihat</p>

                    {/* Bookmark Button */}
                    <BookmarkButton seriesSlug={cleanedSlug} seriesTitle={series.title} seriesImage={series.image} />
                  </div>

                  {/* Right - Info */}
                  <div className="flex-1">
                    {/* Synopsis */}
                    {series.synopsis && <p className="text-gray-300 text-sm leading-relaxed mb-6">{series.synopsis}</p>}

                    {/* Chapter Navigation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {latestChapter && (
                        <div className="text-sm text-gray-400">
                          Terbaru:{" "}
                          <Link href={`/series/${encodeSlug(cleanedSlug)}/${encodeSlug(extractSeriesSlug(latestChapter.slug))}`} className="text-green-400 hover:underline font-semibold">
                            {latestChapter.title}
                          </Link>
                        </div>
                      )}
                      {firstChapter && (
                        <div className="text-sm text-gray-400 ml-4">
                          Awal:{" "}
                          <Link href={`/series/${encodeSlug(cleanedSlug)}/${encodeSlug(extractSeriesSlug(firstChapter.slug))}`} className="text-green-400 hover:underline font-semibold">
                            {firstChapter.title}
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Info Table */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      {series.released && (
                        <>
                          <div className="text-gray-400">Tahun Rilis</div>
                          <div className="text-white">{series.released}</div>
                        </>
                      )}
                      {series.author && (
                        <>
                          <div className="text-gray-400">Author</div>
                          <div className="text-green-400">{series.author}</div>
                        </>
                      )}
                      {series.artist && (
                        <>
                          <div className="text-gray-400">Artist</div>
                          <div className="text-green-400">{series.artist}</div>
                        </>
                      )}
                      {series.serialization && (
                        <>
                          <div className="text-gray-400">Serialization</div>
                          <div className="text-green-400">{series.serialization}</div>
                        </>
                      )}
                      {series.status && (
                        <>
                          <div className="text-gray-400">Status</div>
                          <div className="text-green-400">{series.status}</div>
                        </>
                      )}
                      {series.type && (
                        <>
                          <div className="text-gray-400">Type</div>
                          <div className="text-white">{series.type}</div>
                        </>
                      )}
                      {series.postedBy && (
                        <>
                          <div className="text-gray-400">Posted by</div>
                          <div className="text-white">{series.postedBy}</div>
                        </>
                      )}
                      {series.postedOn && (
                        <>
                          <div className="text-gray-400">Posted on</div>
                          <div className="text-white">{series.postedOn}</div>
                        </>
                      )}
                      {series.updatedOn && (
                        <>
                          <div className="text-gray-400">Updated on</div>
                          <div className="text-white">{series.updatedOn}</div>
                        </>
                      )}
                    </div>

                    {/* Genre Tags */}
                    {series.genres && series.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {series.genres.map((genre: string, idx: number) => (
                          <Link
                            key={idx}
                            href={`/search?genre=${genre.toLowerCase().replace(" ", "-")}`}
                            className="px-3 py-1.5 bg-[#2a3142] border border-gray-700 text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 rounded text-xs font-medium transition-colors">
                            {genre}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-orange-300 text-sm">
                  <strong>Peringatan:</strong> Komik ini mungkin mengandung konten kekerasan, berdarah, atau seksual yang tidak sesuai untuk pembaca di bawah umur.
                </p>
              </div>
            </div>

            {/* Chapter List Section */}
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Chapter List</h2>
                {/* Social Share Buttons */}
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#3b5998] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                    Facebook
                  </button>
                  <button className="px-3 py-1 bg-[#1da1f2] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                    Twitter
                  </button>
                  <button className="px-3 py-1 bg-[#25d366] text-white text-xs font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Whatsapp
                  </button>
                </div>
              </div>

              <div className="p-4">
                <ChaptersSection chapters={series.chapters || []} seriesSlug={cleanedSlug} seriesTitle={series.title} />
              </div>
            </div>
          </main>

          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block">
            <Sidebar popularManga={sidebarPopularManga} />
          </div>
        </div>
      </div>
    </div>
  );
}

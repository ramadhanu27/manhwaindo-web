import { getLastUpdate, getPopular, getProject, getSeriesDetail, fetchActualImageUrl } from "@/lib/api";
import SeriesCard from "@/components/SeriesCard";
import HeroCarousel from "@/components/HeroCarousel";
import ProjectUpdatesSection from "@/components/ProjectUpdatesSection";
import LatestUpdateSection from "@/components/LatestUpdateSection";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

// Helper function to clean slugs
const cleanSlug = (slug: string) => slug.replace(/\/+$/, "").trim();

export default async function Home() {
  // Fetch data
  const [lastUpdateData, popularData, projectData] = await Promise.all([getLastUpdate(1), getPopular(), getProject(1)]);

  // Deduplicate series by slug to avoid React key errors
  const deduplicateSeries = (series: any[]) => {
    const seriesMap = new Map();
    series.forEach((item: any) => {
      if (!seriesMap.has(item.slug)) {
        seriesMap.set(item.slug, item);
      }
    });
    return Array.from(seriesMap.values());
  };

  const lastUpdateSeries = lastUpdateData.success ? deduplicateSeries(lastUpdateData.data) : [];
  const popularSeries = popularData.success ? deduplicateSeries(popularData.data) : [];
  const projectSeries = projectData.success ? deduplicateSeries(projectData.data) : [];

  // Fetch detailed series data for carousel (synopsis and chapters)
  const carouselSeriesBasic = popularSeries.slice(0, 4);
  const carouselSeriesDetails = await Promise.all(carouselSeriesBasic.map((series) => getSeriesDetail(series.slug)));

  // Fetch actual images for carousel series
  const carouselSeriesImages = await Promise.all(
    carouselSeriesBasic.map((series) => {
      // Use url field if available, otherwise construct from slug
      const seriesUrl = series.url || `https://www.manhwaindo.my/series/${series.slug}/`;
      return fetchActualImageUrl(seriesUrl);
    })
  );

  const carouselSeries = carouselSeriesBasic.map((series, idx) => {
    const detail = carouselSeriesDetails[idx];
    const actualImage = carouselSeriesImages[idx];

    // Handle both success flag and direct data properties
    if (detail && ((detail.success && detail.data) || detail.data)) {
      const data = detail.data || detail;
      return {
        ...series,
        image: actualImage || series.image,
        synopsis: data.synopsis || series.synopsis,
        chapters: data.chapters || [],
        genres: data.genres || series.genres,
      };
    }
    return {
      ...series,
      image: actualImage || series.image,
    };
  });

  // Prepare popular manga for sidebar
  const sidebarPopularManga = popularSeries.slice(0, 10).map((series: any) => ({
    slug: series.slug,
    title: series.title,
    image: series.image,
    genres: series.genres || [],
    rating: series.rating,
  }));

  return (
    <div className="min-h-screen bg-[#0f1319]">
      <div className="container mx-auto px-4 py-6">
        {/* Main Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop only, appears on LEFT */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0 lg:order-2">
            <Sidebar popularManga={sidebarPopularManga} />
          </div>

          {/* Main Content - appears on RIGHT in code but LEFT visually due to order */}
          <main className="flex-1 min-w-0 lg:order-1">
            {/* Hero Carousel / Featured */}
            <section className="mb-8">
              <HeroCarousel series={carouselSeries} />
            </section>

            {/* Project Updates */}
            <ProjectUpdatesSection series={projectSeries} />

            {/* Latest Update */}
            <LatestUpdateSection series={lastUpdateSeries} />
          </main>
        </div>
      </div>
    </div>
  );
}

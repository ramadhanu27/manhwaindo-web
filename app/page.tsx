import { getLastUpdate, getPopular, getProject, getSeriesDetail } from '@/lib/api';
import SeriesCard from '@/components/SeriesCard';
import HeroCarousel from '@/components/HeroCarousel';
import ProjectUpdatesSection from '@/components/ProjectUpdatesSection';
import LatestUpdateSection from '@/components/LatestUpdateSection';
import Link from 'next/link';

// Helper function to clean slugs
const cleanSlug = (slug: string) => slug.replace(/\/+$/, '').trim();

export default async function Home() {
  // Fetch data
  const [lastUpdateData, popularData, projectData] = await Promise.all([
    getLastUpdate(1),
    getPopular(),
    getProject(1),
  ]);

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
  const carouselSeriesDetails = await Promise.all(
    carouselSeriesBasic.map(series => getSeriesDetail(series.slug))
  );

  const carouselSeries = carouselSeriesBasic.map((series, idx) => {
    const detail = carouselSeriesDetails[idx];
    if (detail.success && detail.data) {
      return {
        ...series,
        synopsis: detail.data.synopsis || series.synopsis,
        chapters: detail.data.chapters || [],
        genres: detail.data.genres || series.genres,
      };
    }
    return series;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Carousel */}
        <section className="mb-12">
          <HeroCarousel series={carouselSeries} />
        </section>

        {/* Popular Today */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Today</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {popularSeries.slice(0, 7).map((series: any) => (
              <SeriesCard
                key={series.slug}
                title={series.title}
                slug={series.slug}
                image={series.image}
                type={series.type}
                rating={series.rating}
                isHot={true}
              />
            ))}
          </div>
        </section>

      {/* Project Updates */}
      <ProjectUpdatesSection series={projectSeries} />

      

      {/* Latest Update */}
      <LatestUpdateSection series={lastUpdateSeries} />

      </div>
    </div>
  );
}
